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
import { error_400, error_401, error_404 } from "../../utils/api-response-helper";
import { ConfigService } from "@nestjs/config";
import { UserAuth } from "../../decorators/user-auth.decorator";
import { CartService } from "./cart.service";
import { RequestUserAddProductToCartDto, RequestUserUpdateItemQtyDto } from "./dto/cart.dto";
import { RequestUserCreateOrderDto } from "./dto/user-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { User } from "./entities/user.entity";

@UserAuth()
@ApiTags("User")
@Controller("user/me")
export class UserOrderController {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService,
    private configService: ConfigService
  ) {
  }

  @CustomApiResponse({
    status: 204,
    description: "success"
  })
  @ApiOperation({
    summary: "create order"
  })
  @Post("order")
  async create(@Body(ValidationPipe) body: RequestUserCreateOrderDto, @Request() request: any) {
    try {
      const userId: User = request.user.id;
      const { paymentType } = body;
      const cart = await this.cartService.findByUserId(userId);
      if (!cart?.id || cart?.products?.length < 1) {
        return error_400();
      }

      const orderResponse: any = await this.orderService.create(paymentType, cart, userId);

      if (orderResponse?.success === true) {
        // call paymentgateway
        return {
          data: {
            redirect: "www.paymentgateway.abc?order_id=" + orderResponse.orderId
          }
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
    summary: "get user orders"
  })
  @Get("orders")
  async getOrders(@Request() request: any) {
    try {
      const userId: User = request.user.id;
      const orders: any = await this.orderService.all(userId);
      let orderResponse = [];
      orders.map((order) => {
        const { nextTimeForClearProduct, ...filterOrderData } = order;
        const orderItems = [];
        filterOrderData.items.map((item) => {
          const { costSnapshot, nameSnapshot, skuSnapshot, product, ...filterItemData } = item;
          const {
            quantity,
            reserved,
            price,
            cost,
            name,
            sku,
            limitPerCart,
            status,
            stock,
            ...filterProductData
          } = item.product;
          orderItems.push({
            ...filterItemData,
            itemId: filterItemData.id,
            productId: filterProductData.id,
            ...filterProductData,
            id: undefined,
            sku: skuSnapshot,
            name: nameSnapshot
          });
        });
        orderResponse.push({
          ...filterOrderData,
          items: orderItems
        });
      });
      return {
        data: orderResponse,
        httpStatusCode: 200
      };

    } catch (error) {
      console.error(error);
    }

    return error_404();
  }
}
