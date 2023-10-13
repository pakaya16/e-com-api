import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsExists } from "../../../utils/validators";
import { ProductStatus } from "../entities/product.entity";

export class RequestSellerCreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsExists({
    tableName: "category_product",
    column: "id"
  })
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Quantity must be at least 1" })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Price must be at least 1" })
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Cost must be at least 1" })
  cost: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limitPerCart: number;
}

export class RequestSellerPutUpdateProductDto extends RequestSellerCreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

export class RequestSellerPatchUpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsExists({
    tableName: "category_product",
    column: "id"
  })
  categoryId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Quantity must be at least 1" })
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Price must be at least 1" })
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Cost must be at least 1" })
  cost: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limitPerCart: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

export class RequestSellerGetProductDetailDto {
  @ApiProperty({
    example: "1"
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
}