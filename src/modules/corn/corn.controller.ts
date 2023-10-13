import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
  Controller,
  Get
} from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import { CartService } from "../user/cart.service";

@Public()
@ApiTags("Corn")
@Controller("corn")
export class CornController {
  constructor(
    private cartService1: CartService,
    private cartService: CartService
  ) {
  }

  @CustomApiResponse({
    status: 200,
    description: "corn clear cart."
  })
  @ApiOperation({
    summary: "in prod env, this function will run by schedule"
  })
  @Get("/clear/cart")
  async clearCart() {
    const data = await this.cartService.allCartItemsExpire();

    if (data.length > 0) {
      const itemList = [];
      for (let i = 0; i < data.length; i++) {
        itemList.push({
          itemId: data[i].id,
          productId: data[i].product.id
        });
      }
      await this.cartService.clearItemsInCart(itemList);
    }

    return {
      httpStatusCode: 200
    };
  }
}
