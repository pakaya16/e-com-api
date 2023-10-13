import {
  IsNotEmpty,
  IsNumber,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class RequestUserAddProductToCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "ProductId must be at least 1" })
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Quantity must be at least 1" })
  quantity: number;
}

export class RequestUserUpdateItemQtyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Quantity must be at least 1" })
  minusQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Quantity must be at least 1" })
  itemId: number;
}