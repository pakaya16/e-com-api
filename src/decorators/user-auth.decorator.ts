import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export function UserAuth() {
  return applyDecorators(
    ApiBearerAuth("user-jwt")
  );
}