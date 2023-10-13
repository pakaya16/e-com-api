import { Entity, OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";


export enum UserStatus {
  enable = "enable",
  disable = "disable"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: UserStatus })
  status: UserStatus;

  @Column()
  password: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  shoppingCarts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
