import {
  IsString,
  IsNotEmpty,
  IsEnum
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "../entities/order.entity";

export class RequestUserCreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentType, {
    message: `Payment type must be a valid enum value: ${Object.values(PaymentType).join(", ")}`
  })
  paymentType: PaymentType;
}