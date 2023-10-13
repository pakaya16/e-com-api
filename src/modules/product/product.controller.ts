import { ApiTags } from "@nestjs/swagger";
// import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  Get,
  Query,
  ValidationPipe
} from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { error_401, error_404 } from "../../utils/api-response-helper";
import * as jwtFn from "jsonwebtoken";
// import { RequestSellerCreateProductDto } from "./dto/seller-create-product.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import { RequestGetProductsByCategoryDto, RequestGetProductsBySellerDto } from "./dto/product.dto";
import { PaginationDto } from "../../dto/pagination.dto";
import { productResponseHelper } from "./helper/user-product-response";

@Public()
@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(
    private productService: ProductService
  ) {
  }

  @CustomApiResponse({
    status: 200,
    description: "user get all product"
  })
  @Get("/all")
  async all(@Query() query: PaginationDto) {
    const { page, limit } = query;
    const [rawProducts, totalCount] = await this.productService.findALlPagination(page, limit);
    const products = productResponseHelper({
      rawProducts
    });
    return {
      products,
      totalCount
    };
  }

  @CustomApiResponse({
    status: 200,
    description: "user get product detail"
  })
  @Get("/category/:categoryId")
  async productsByCategory(@Param() params: RequestGetProductsByCategoryDto, @Query() query: PaginationDto) {
    const categoryId = parseInt("" + params?.categoryId || "0");
    const { page, limit } = query;
    if (categoryId) {
      const [rawProducts, totalCount] = await this.productService.findByConditionPagination({
        category: { id: categoryId }
      }, page, limit);
      const products = productResponseHelper({
        rawProducts
      });
      return {
        products,
        totalCount
      };
    }

    return error_404();
  }

  @CustomApiResponse({
    status: 200,
    description: "user get product by seller"
  })
  @Get("/seller/:sellerId")
  async productsBySeller(@Param() params: RequestGetProductsBySellerDto, @Query() query: PaginationDto) {
    const sellerId = parseInt("" + params?.sellerId || "0");
    const { page, limit } = query;
    if (sellerId) {
      const [rawProducts, totalCount] = await this.productService.findByConditionPagination({
        seller: {
          id: sellerId
        }
      }, page, limit);
      const products = productResponseHelper({
        rawProducts
      });

      return {
        products,
        totalCount
      };
    }

    return error_404();
  }
}
