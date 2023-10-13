import {
  IsString,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestGetProductsByCategoryDto {
  @ApiProperty({
    example: "1"
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class RequestGetProductsBySellerDto {
  @ApiProperty({
    example: "1"
  })
  @IsNotEmpty()
  @IsString()
  sellerId: string;
}