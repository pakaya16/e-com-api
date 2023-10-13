import {
  Entity, ManyToOne, JoinColumn,
  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Order } from "../../user/entities/order.entity";

export enum PaymentStatus {
  create = "create",
  successPayment = "successPayment"
}

@Entity()
export class PaymentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("json")
  apiBody: any;

  @Column({ type: "enum", enum: PaymentStatus })
  status: PaymentStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @Column({ nullable: true })
  orderId?: number;
}