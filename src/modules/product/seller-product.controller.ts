import { ApiTags } from "@nestjs/swagger";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  ValidationPipe
} from "@nestjs/common";
import { error_400, error_401, error_404 } from "../../utils/api-response-helper";
import {
  RequestSellerCreateProductDto,
  RequestSellerGetProductDetailDto, RequestSellerPatchUpdateProductDto,
  RequestSellerPutUpdateProductDto
} from "./dto/seller-product.dto";
import { ProductService } from "./product.service";
import { SellerAuth } from "../../decorators/seller-auth.decorator";

@SellerAuth()
@ApiTags("Product")
@Controller("seller/product")
export class SellerProductController {
  constructor(
    private productService: ProductService
  ) {
  }

  @CustomApiResponse({
    status: 200,
    description: "seller get product detail"
  })
  @Get(":productId")
  async detail(@Param() params: RequestSellerGetProductDetailDto, @Request() request: any) {
    const sellerId = parseInt(request?.user?.id || 0);
    const productId = parseInt(params?.productId || "0");
    const response = await this.productService.findWithSeller(productId, sellerId);
    if (response?.id) {
      return {
        httpStatusCode: 200,
        data: response
      };
    } else {
      return error_404();
    }
  }

  @CustomApiResponse({
    status: 200,
    description: "seller create product"
  })
  @Post("/")
  async create(@Body(ValidationPipe) body: RequestSellerCreateProductDto, @Request() request: any) {
    try {
      const sellerId: number = request.user.id;
      const response = await this.productService.create({
        sellerId,
        ...body
      });

      if (response === false) {
        return {
          httpStatusCode: 400,
          message: [
            "sku is duplicate."
          ]
        }
      }

      return {
        httpStatusCode: 200,
        data: {
          id: response.id
        }
      };
    } catch (error) {
      console.error(error);
      return error_400();
    }
  }

  @CustomApiResponse({
    status: 204,
    description: "seller update product detail"
  })
  @Put(":productId")
  async update(@Param() params: RequestSellerGetProductDetailDto, @Body(ValidationPipe) body: RequestSellerPutUpdateProductDto, @Request() request: any) {
    try {
      const sellerId: number = request.user.id;
      const productId = parseInt(params?.productId || "0");
      const { categoryId, name, description, sku, quantity, price, limitPerCart, status, cost } = body;
      const response = await this.productService.findWithSeller(productId, sellerId);

      if (response?.id) {
        const checkSku = await this.productService.findBySkuWithSeller(sku, sellerId);
        if (checkSku?.id && parseInt(checkSku?.id + "") !== productId) {
          return {
            httpStatusCode: 400,
            message: [
              "sku is duplicate."
            ]
          };
        }

        try {
          await this.productService.update(productId, {
            category: categoryId,
            name, description, sku, quantity, price,
            limitPerCart, status, stock: quantity, cost
          });
          return {
            httpStatusCode: 204
          };
        } catch (error) {
          console.log("error", error);
          return {
            httpStatusCode: 500
          };
        }
      }
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 204,
    description: "seller patch update product detail"
  })
  @Patch(":productId")
  async patch(@Param() params: RequestSellerGetProductDetailDto, @Body(ValidationPipe) body: RequestSellerPatchUpdateProductDto, @Request() request: any) {
    try {
      const sellerId: number = request.user.id;
      const productId = parseInt(params?.productId || "0");
      const { categoryId, name, description, sku, quantity, price, limitPerCart, status, cost } = body;
      const response = await this.productService.findWithSeller(productId, sellerId);

      if (response?.id) {
        const checkSku = await this.productService.findBySkuWithSeller(sku, sellerId);
        if (checkSku?.id && parseInt(checkSku?.id + "") !== productId) {
          return {
            httpStatusCode: 400,
            message: [
              "sku is duplicate."
            ]
          };
        }

        try {
          await this.productService.update(productId, {
            ...(categoryId ? { category: categoryId } : {}),
            ...(name ? { name } : {}),
            ...(description ? { description } : {}),
            ...(sku ? { sku } : {}),
            ...(quantity ? { quantity, stock: quantity } : {}),
            ...(price ? { price } : {}),
            ...(limitPerCart ? { limitPerCart } : {}),
            ...(status ? { status } : {}),
            ...(cost ? { cost } : {})
          });
          return {
            httpStatusCode: 204
          };
        } catch (error) {
          console.error(error);
          return {
            httpStatusCode: 500
          };
        }
      }
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 204,
    description: "seller delete product detail"
  })
  @Delete(":productId")
  async delete(@Param() params: RequestSellerGetProductDetailDto, @Request() request: any) {
    try {
      const sellerId: number = request.user.id;
      const productId = parseInt(params?.productId || "0");
      const response = await this.productService.findWithSeller(productId, sellerId);
      if (response?.id) {
        try {
          await this.productService.delete(productId);
          return {
            httpStatusCode: 204
          };
        } catch (error) {
          console.error(error);
          return error_400();
        }
      }
    } catch (error) {
      console.error(error);
    }

    return error_404();
  }
}
