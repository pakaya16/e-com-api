import { applyDecorators, UseGuards, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SellerJwtGuard } from "../guards/seller-jwt.guard";

export function SellerAuth() {
  return applyDecorators(
    SetMetadata('isSellerAuth', true),
    UseGuards(SellerJwtGuard),
    ApiBearerAuth("seller-jwt")
  );
}