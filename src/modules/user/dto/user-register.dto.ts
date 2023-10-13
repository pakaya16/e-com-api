import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsEmail
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsUnique } from "../../../utils/validators";

export class RequestUserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({
    minimum: 8,
    maximum: 20
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password is too short, minimum length is 8 characters" })
  @MaxLength(20, { message: "Password is too long, maximum length is 20 characters" })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: "Password is too weak, it must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character" }
  )
  password: string;
}

export class RequestUserRegisterDto extends RequestUserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  @IsUnique({ tableName: "seller", column: "email" })
  email: string;
}