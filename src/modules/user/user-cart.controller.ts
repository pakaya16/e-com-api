import { UserService } from "./user.service";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Delete,
  Patch,
  ValidationPipe
} from "@nestjs/common";
import { error_401, error_404 } from "../../utils/api-response-helper";
import { ConfigService } from "@nestjs/config";
import { UserAuth } from "../../decorators/user-auth.decorator";
import { CartService } from "./cart.service";
import { RequestUserAddProductToCartDto, RequestUserUpdateItemQtyDto } from "./dto/cart.dto";
import { User } from "./entities/user.entity";

@UserAuth()
@ApiTags("User")
@Controller("user/me/cart")
export class UserCartController {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private configService: ConfigService
  ) {
  }

  @CustomApiResponse({
    status: 200,
    description: "success"
  })
  @ApiOperation({
    summary: "get my cart detail"
  })
  @Get("/")
  async me(@Request() request: any) {
    try {
      const userId: User = request.user.id;
      let cart: any = await this.cartService.findByUserId(userId);

      if (!cart?.id) {
        await this.cartService.create(userId);
        cart = await this.cartService.findByUserId(userId);
      }

      let cartResponse = {
        ...cart
      };
      if (cart?.products?.length > 0) {
        const products = [];
        cart.products.map((cartProduct) => {
          const { nextTimeForClearProduct, product, ...cartProductData } = cartProduct;
          const { reserved, stock, cost, quantity, limitPerCart, createdAt, updatedAt, ...productDetail } = cartProduct.product;
          products.push({
            itemId: cartProductData.id,
            ...cartProductData,
            ...productDetail,
            productId: productDetail.id,
            id: undefined
          });
        });

        cartResponse = {
          ...cartResponse,
          products
        };
      }
      return {
        httpStatusCode: 200,
        data: cartResponse
      };
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 200,
    description: "success"
  })
  @ApiOperation({
    summary: "remove all products in cart."
  })
  @Delete("/clear-products")
  async clearProductCart(@Request() request: any) {
    try {
      const userId: number = request.user.id;
      const isSuccess = await this.cartService.clearProductsInCart(userId);

      if (isSuccess === true) {
        return {
          httpStatusCode: 204
        };
      }
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 204,
    description: "success"
  })
  @ApiOperation({
    summary: "add product quantity to cart."
  })
  @Post("/add-product")
  async addProduct(@Body(ValidationPipe) body: RequestUserAddProductToCartDto, @Request() request: any) {
    try {
      const userId: User = request.user.id;
      const { productId, quantity } = body;
      let cart: any = await this.cartService.findByUserId(userId);

      if (!cart?.id) {
        cart = await this.cartService.create(userId);
      }

      const cartId = cart.id;
      const { success, message }: any = await this.cartService.addProductToCart(cartId, productId, quantity);

      if (success === false) {
        return {
          httpStatusCode: 400,
          message
        };
      }

      return {
        httpStatusCode: 204
      };
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 204,
    description: "success"
  })
  @ApiOperation({
    summary: "minus product quantity in cart."
  })
  @Patch("/minus-quantity")
  async updateProductQuantity(@Body(ValidationPipe) body: RequestUserUpdateItemQtyDto, @Request() request: any) {
    try {
      const userId: User = request.user.id;
      const { minusQuantity, itemId } = body;
      const { success, message }: any = await this.cartService.updateItemQuantity(userId, itemId, minusQuantity);

      if (success === true) {
        return {
          httpStatusCode: 204
        };
      } else if (success === false && message) {
        return {
          httpStatusCode: 400,
          message
        };
      }
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }
}
