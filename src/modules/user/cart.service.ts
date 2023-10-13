import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectEntityManager } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Cart, CartItems } from "./entities/cart.entity";
import { Not, In, MoreThan } from "typeorm";
import { addMinutes } from "date-fns";
import { EntityManager } from "typeorm";
import { ProductService } from "../product/product.service";
import { Product } from "../product/entities/product.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItems)
    private cartItemsRepository: Repository<CartItems>,
    private configService: ConfigService,
    private productService: ProductService,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {
  }

  async findByUserId(userId: any, withRelations: boolean = true) {
    const status: any = ["checkout", "successPayment"];
    return await this.cartRepository.findOne({
      where: {
        user: {
          id: userId
        },
        status: Not(In(status))
      },
      ...(withRelations ? {
        relations: ["products.product"]
      } : {})
    });
  }

  async create(userId: any) {
    const status: any = "create";
    return await this.cartRepository.save({
      user: userId,
      status
    });
  }

  async findProductInCart(cartId: any, productId: any) {
    return await this.cartItemsRepository.findOne({
      where: {
        cart: {
          id: cartId
        },
        product: productId
      }
    });
  }

  async findByItem(itemId: number, cartId: any) {
    return await this.cartItemsRepository.findOne({
      where: {
        cart: cartId,
        id: itemId
      },
      relations: ["product"]
    });
  }

  async addProductToCartCaseNewProduct({ cartId, product, userQuantity, productId }) {
    const realStock = product.stock - product.reserved;
    if (realStock > 0 && realStock >= userQuantity) {
      const minTimeClearProduct = parseInt(this.configService.get<string>("MIN_TIME_CLEAR_PRODUCT_IN_CART"));

      try {
        const cartItem = new CartItems();
        cartItem.cart = cartId;
        cartItem.product = productId;
        cartItem.quantity = userQuantity;
        cartItem.nextTimeForClearProduct = addMinutes(new Date(), minTimeClearProduct);
        const newQuantity = realStock - userQuantity;
        const newReserved = userQuantity + product.reserved;

        await this.entityManager.transaction(async transactionalEntityManager => {
          await transactionalEntityManager.save(CartItems, cartItem);
          await transactionalEntityManager.update(Product, productId, {
            reserved: newReserved,
            quantity: newQuantity
          });
          const selectedProduct = await transactionalEntityManager.findOne(Product, {
            where: {
              id: productId
            }
          });
          if (selectedProduct.quantity !== newQuantity || selectedProduct.reserved !== newReserved || selectedProduct.quantity < 0) {
            throw new Error("Product error, transaction rolled back");
          }
        });

        return {
          success: true
        };
      } catch (error) {
        console.error("Transaction error:", error.message);
      }
    }

    return {
      success: false,
      message: [
        "quantity not enough."
      ]
    };
  }

  async addProductToCartCaseUpdateQty({ product, userQuantity, productId, productInCart }) {
    const realStock = product.stock - product.reserved;
    if (realStock > 0 && realStock >= userQuantity) {
      const minTimeClearProduct = parseInt(this.configService.get<string>("MIN_TIME_CLEAR_PRODUCT_IN_CART"));

      try {
        const newQuantity = realStock - userQuantity;
        const newReserved = userQuantity + product.reserved;
        await this.entityManager.transaction(async transactionalEntityManager => {
          await transactionalEntityManager.update(CartItems, productInCart.id, {
            quantity: productInCart.quantity + userQuantity,
            nextTimeForClearProduct: addMinutes(new Date(), minTimeClearProduct)
          });
          await transactionalEntityManager.update(Product, productId, {
            reserved: newReserved,
            quantity: newQuantity
          });
          const selectedProduct = await transactionalEntityManager.findOne(Product, {
            where: {
              id: productId
            }
          });
          if (selectedProduct.quantity !== newQuantity || selectedProduct.reserved !== newReserved || selectedProduct.quantity < 0) {
            throw new Error("Product error, transaction rolled back");
          }
        });

        return {
          success: true
        };
      } catch (error) {
        console.error("Transaction error:", error.message);
      }
    }

    return {
      success: false,
      message: [
        "quantity not enough."
      ]
    };
  }

  async addProductToCart(cartId: any, productId: any, userQuantity: number) {
    let response: any = {
      success: false,
      message: [
        "quantity not enough."
      ]
    };
    const product = await this.productService.find(productId);
    const productInCart = await this.findProductInCart(cartId, productId);

    if (product?.id) {
      if (productInCart?.id) {
        if (product.limitPerCart >= (userQuantity + productInCart.quantity)) {
          return await this.addProductToCartCaseUpdateQty({
            product, userQuantity, productId, productInCart
          });
        } else {
          response = {
            ...response,
            message: [
              "item over limit in cart."
            ]
          };
        }
      } else {
        if (product.limitPerCart >= userQuantity) {
          return await this.addProductToCartCaseNewProduct({
            product, userQuantity, productId, cartId
          });
        } else {
          response = {
            ...response,
            message: [
              "item over limit in cart."
            ]
          };
        }
      }
    }

    return response;
  }

  async clearProductsInCart(userId: any) {
    const cartData = await this.findByUserId(userId);

    if (!cartData?.id)
      return false;

    if (cartData?.products?.length > 0) {
      try {
        await this.entityManager.transaction(async transactionalEntityManager => {
          const cartProducts = cartData.products;
          for (let i = 0; i < cartProducts.length; i++) {
            const itemId = cartProducts[i].id;
            const productId = cartProducts[i].product.id;
            await this.removeProductItemInCart(itemId, transactionalEntityManager, productId);
          }
        });

        return true;
      } catch (error) {
        console.error("Transaction error:", error.message);
        return false;
      }
    } else {
      return true;
    }
  }

  async removeProductItemInCart(itemId: any, transactionalEntityManager: any, productId) {
    const selectCartItem = await transactionalEntityManager.findOne(CartItems, {
      where: {
        id: itemId
      }
    });
    const selectedProduct = await transactionalEntityManager.findOne(Product, {
      where: {
        id: productId
      }
    });

    const userQuantity = selectCartItem.quantity;
    const productQuantity = selectedProduct.quantity;
    const productStock = selectedProduct.stock;
    const productReserved = selectedProduct.reserved;
    const newReserved = productReserved - userQuantity;
    const newQuantity = productStock - newReserved;
    if (newQuantity <= productQuantity) {
      throw new Error("Product error, transaction rolled back");
    }

    await transactionalEntityManager.update(Product, productId, {
      reserved: newReserved,
      quantity: newQuantity
    });
    await transactionalEntityManager.delete(CartItems, itemId);
  }

  async updateItemQuantity(userId: User, itemId: number, minusQuantity: number) {
    const response: any = {
      success: false
    };
    const cart = await this.findByUserId(userId, false);
    const cartProduct: any = await this.findByItem(itemId, cart.id);

    if (!cart?.id || !cartProduct?.id) {
      return response;
    }

    const currentSelectQty = cartProduct.quantity;
    const productId = cartProduct.product.id;
    const limitPerCart = cartProduct.product.limitPerCart;
    const product = cartProduct.product;
    const userQuantity = currentSelectQty - minusQuantity;

    if (userQuantity < 0) {
      return {
        ...response,
        message: [
          "quantity can not be 0."
        ]
      };
    } else if ((currentSelectQty - minusQuantity) > limitPerCart) {
      return {
        ...response,
        message: [
          "item over limit in cart."
        ]
      };
    }

    if (userQuantity === 0) {
      try {
        await this.entityManager.transaction(async transactionalEntityManager => {
          await this.removeProductItemInCart(itemId, transactionalEntityManager, productId);
        });

        return {
          success: true
        };
      } catch (error) {
        console.error("Transaction error:", error.message);
      }
    } else {
      const realStock = product.stock - product.reserved;
      const minTimeClearProduct = parseInt(this.configService.get<string>("MIN_TIME_CLEAR_PRODUCT_IN_CART"));
      try {
        const newReserved = product.reserved - minusQuantity;
        const newQuantity = realStock + minusQuantity;
        await this.entityManager.transaction(async transactionalEntityManager => {
          await transactionalEntityManager.update(CartItems, cartProduct.id, {
            quantity: userQuantity,
            nextTimeForClearProduct: addMinutes(new Date(), minTimeClearProduct)
          });
          await transactionalEntityManager.update(Product, productId, {
            reserved: newReserved,
            quantity: newQuantity
          });
          const selectedProduct = await transactionalEntityManager.findOne(Product, {
            where: {
              id: productId
            }
          });
          if (selectedProduct.quantity !== newQuantity || selectedProduct.reserved !== newReserved || selectedProduct.quantity < 0) {
            throw new Error("Product error, transaction rolled back");
          }
        });

        return {
          success: true
        };
      } catch (error) {
        console.error("Transaction error:", error.message);
      }
    }

    return {
      ...response,
      message: [
        "quantity not enough."
      ]
    };
  }

  async clearItemsInCart(list: any) {
    try {
      await this.entityManager.transaction(async transactionalEntityManager => {
        for (let i = 0; i < list.length; i++) {
          const itemId = list[i].itemId;
          const productId = list[i].productId;
          await this.removeProductItemInCart(itemId, transactionalEntityManager, productId);
        }
      });
      return {
        success: true
      };
    } catch (error) {
      console.error("Transaction error:", error.message);
    }
  }

  async allCartItemsExpire() {
    return await this.cartItemsRepository
      .createQueryBuilder("cartItems")
      .innerJoinAndSelect("cartItems.cart", "cart")
      .innerJoinAndSelect("cartItems.product", "product")
      .where("cart.status != :status", { status: "successPayment" })
      .andWhere("cartItems.nextTimeForClearProduct < :timeClear", { timeClear: new Date() })
      .select(["cartItems", "cart.status", "cart.id", "product.id"])
      .getMany();
  }
}
