import {
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class WebhookCallbackDto {
  @ApiProperty()
  @IsOptional()
  orderId: number;
}