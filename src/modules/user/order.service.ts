import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectEntityManager } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Order, OrderItems, PaymentType } from "./entities/order.entity";
import { Cart, CartItems } from "./entities/cart.entity";
import { Product } from "../product/entities/product.entity";
import { EntityManager } from "typeorm";
import { addMinutes } from "date-fns";
import { User } from "./entities/user.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private configService: ConfigService,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {
  }

  async find(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['cart']
    });
  }

  async all(userId: User) {
    return this.orderRepository.find({
      where: { user: userId },
      relations: ["items.product"]
    });
  }

  async create(paymentType: PaymentType, cart: Cart, userId: User) {
    const cartItems = cart.products;
    const cartId: any = cart.id;
    let orderId: any = null;
    try {
      const minTimeClearProduct = parseInt(this.configService.get<string>("MIN_TIME_CLEAR_PRODUCT_IN_CART"));
      await this.entityManager.transaction(async transactionalEntityManager => {
        const waitPayment: any = "waitPayment";
        let totalPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
          const price = cartItems[i].product.price;
          const itemQuantity = cartItems[i].quantity;
          totalPrice = totalPrice + (price * itemQuantity);
        }
        const orderStatus: any = "create";
        const orderCreate = new Order();
        orderCreate.paymentType = paymentType;
        orderCreate.cart = cartId;
        orderCreate.paymentStatus = waitPayment;
        orderCreate.nextTimeForClearProduct = addMinutes(new Date(), minTimeClearProduct);
        orderCreate.totalPrice = totalPrice;
        orderCreate.status = orderStatus;
        orderCreate.user = userId;
        const orderData = await transactionalEntityManager.save(Order, orderCreate);
        const cartStatus: any = "checkout";
        orderId = orderData.id;
        await transactionalEntityManager.update(Cart, cartId, {
          status: cartStatus,
          order: orderId
        });
        if (orderId) {
          for (let i = 0; i < cartItems.length; i++) {
            const itemQuantity = cartItems[i].quantity;
            const itemId = cartItems[i].id;
            const productId: any = cartItems[i].product.id;
            const cost = cartItems[i].product.cost;
            const price = cartItems[i].product.price;
            const name = cartItems[i].product.name;
            const sku = cartItems[i].product.sku;
            const reserved = cartItems[i].product.reserved;
            const stock = cartItems[i].product.stock;
            const orderItemCreate = new OrderItems();
            orderItemCreate.order = orderId;
            orderItemCreate.product = productId;
            orderItemCreate.priceSnapshot = price;
            orderItemCreate.itemTotalPrice = price * itemQuantity;
            orderItemCreate.costSnapshot = cost;
            orderItemCreate.nameSnapshot = name;
            orderItemCreate.skuSnapshot = sku;
            orderItemCreate.quantity = itemQuantity;
            await transactionalEntityManager.save(OrderItems, orderItemCreate);
            // await transactionalEntityManager.create(OrderItems, {
            //   order: orderId,
            //   product: productId,
            //   priceSnapshot: price,
            //   costSnapshot: cost,
            //   nameSnapshot: name,
            //   skuSnapshot: sku,
            //   quantity: itemQuantity
            // });
            await transactionalEntityManager.update(CartItems, itemId, {
              nextTimeForClearProduct: null
            });
            const newReserved = reserved - itemQuantity;
            const newStock = stock - itemQuantity;
            await transactionalEntityManager.update(Product, productId, {
              reserved: newReserved,
              stock: newStock
            });
          }
        } else {
          throw new Error("Order error, transaction rolled back");
        }
      });

      return {
        success: true,
        orderId
      };
    } catch (error) {
      console.error("Transaction error:", error.message);
    }

    return {
      success: false
    };
  }
}
