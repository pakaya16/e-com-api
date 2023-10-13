import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { CategoryProduct } from "./entities/category-product.entity";
import { ProductController } from "./product.controller";
import { SellerProductController } from "./seller-product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryProduct, Product])],
  controllers: [ProductController, SellerProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {
}
