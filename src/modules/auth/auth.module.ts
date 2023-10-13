import { Module } from "@nestjs/common";
// import { JwtStrategy } from "./jwt.strategy";
import { UserJwtStrategy } from "./user-jwt.strategy";
import { SellerJwtStrategy } from "./seller-jwt.strategy";
// import { PassportModule } from "@nestjs/passport";
// import { JwtModule } from "@nestjs/jwt";
import { SellerModule } from "../seller/seller.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: "user-jwt" }),
    // JwtModule.register({
    //   secret: process.env.AUTH_SECRET,
    //   signOptions: { expiresIn: "60m" }
    // }),
    SellerModule,
    UserModule
  ],
  providers: [UserJwtStrategy, SellerJwtStrategy],
  exports: []
})
export class AuthModule {
}
