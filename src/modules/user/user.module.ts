import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserCartController } from "./user-cart.controller";
import { CartService } from "./cart.service";
import { Cart, CartItems } from "./entities/cart.entity";
import { ProductModule } from "../product/product.module";
import { UserOrderController } from "./user-order.controller";
import { OrderService } from "./order.service";
import { Order, OrderItems } from "./entities/order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, CartItems, Order, OrderItems]),
    ProductModule
  ],
  providers: [UserService, CartService, OrderService],
  controllers: [UserController, UserCartController, UserOrderController],
  exports: [UserService, OrderService, CartService]
})
export class UserModule {
}
