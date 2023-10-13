import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "./entities/seller.entity";
import { SellerService } from "./seller.service";
import { SellerController } from "./seller.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  providers: [SellerService],
  controllers: [SellerController],
  exports: [SellerService]
})
export class SellerModule {
}
