import {
  IsString,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @IsString()
  page: number;

  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @IsString()
  limit: number;
}