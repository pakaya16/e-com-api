import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectEntityManager } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { PaymentLog } from "./entities/payment.entity";
import { EntityManager } from "typeorm";
import { Cart } from "../user/entities/cart.entity";
import { Order } from "../user/entities/order.entity";
import { OrderService } from "../user/order.service";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentLog)
    private paymentLogRepository: Repository<PaymentLog>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private configService: ConfigService,
    private orderService: OrderService
  ) {
  }

  async create(body: any) {
    const statusCreate: any = "create";
    const orderId = body?.orderId || "";
    return await this.paymentLogRepository.save({
      apiBody: body,
      status: statusCreate,
      orderId
    });
  }

  async successCase(id: number) {
    const paymentLog = await this.paymentLogRepository.findOne({ where: { id } });
    const orderId = paymentLog.orderId;
    const order = await this.orderService.find(orderId);

    if (order?.id) {
      try {
        const cartId: any = order.cart.id;
        await this.entityManager.transaction(async transactionalEntityManager => {
          const successPayment: any = "successPayment";
          await transactionalEntityManager.update(Order, orderId, {
            status: successPayment
          });
          await transactionalEntityManager.update(Cart, cartId, {
            status: successPayment
          });
        });
      } catch (error) {
        console.error(error);
      }
    }

    return false;
  }
}
