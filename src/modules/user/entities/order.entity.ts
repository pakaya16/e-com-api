import {
  Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { User } from "./user.entity";
import { Cart } from "./cart.entity";
import { Product } from "../../product/entities/product.entity";

export enum OrderStatus {
  create = "create",
  pending = "pending",
  successPayment = "successPayment"
}

export enum PaymentType {
  creditCard = "creditCard",
  promptpay = "promptpay",
  cash = "cash"
}

export enum PaymentStatus {
  waitPayment = "waitPayment",
  pending = "pending",
  done = "done",
  reject = "reject"
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToOne(() => Cart, (cart) => cart.order)
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: "create"
  })
  status: OrderStatus;

  @Column({
    type: "enum",
    enum: PaymentType
  })
  paymentType: PaymentType;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: 'waitPayment'
  })
  paymentStatus: PaymentStatus;

  @Column()
  totalPrice: number;

  @OneToMany(() => OrderItems, (items) => items.order)
  items: OrderItems[];

  @CreateDateColumn({ type: "timestamp" })
  nextTimeForClearProduct: Date;
}

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @OneToMany(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  priceSnapshot: number;

  @Column()
  itemTotalPrice: number;

  @Column()
  costSnapshot: number;

  @Column()
  quantity: number;

  @Column()
  nameSnapshot: string;

  @Column()
  skuSnapshot: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}