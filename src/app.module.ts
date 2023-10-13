import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { SellerModule } from "./modules/seller/seller.module";
import { UserJwtGuard } from "./guards/user-jwt.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ProductModule } from "./modules/product/product.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { CornModule } from "./modules/corn/corn.module";
import {
  IsUniqueConstraint,
  IsExistsConstraint
} from "./utils/validators";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "client"),
      exclude: ["/api/(.*)", "/api-docs"]
    }),
    SellerModule,
    AuthModule,
    UserModule,
    ProductModule,
    PaymentModule,
    CornModule
  ],
  controllers: [AppController],
  providers: [AppService, UserJwtGuard, IsUniqueConstraint, IsExistsConstraint]
})
export class AppModule {
}
