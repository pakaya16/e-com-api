import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentLog } from "./entities/payment.entity";
import { PaymentWebhookController } from "./payment-webhook.controller";
import { PaymentService } from "./payment.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentLog]),
    UserModule
  ],
  providers: [PaymentService],
  controllers: [PaymentWebhookController],
  exports: []
})
export class PaymentModule {
}
