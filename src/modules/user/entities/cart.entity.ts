import {
  Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { User } from "./user.entity";
import { Product } from "../../product/entities/product.entity";
import { Order } from "./order.entity";

export enum CartStatus {
  create = "create",
  checkout = "checkout",
  successPayment = "successPayment"
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.shoppingCarts)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "enum", enum: CartStatus })
  status: CartStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart)
  products: CartItems[];

  @OneToOne(() => Order, (order) => order.cart)
  @JoinColumn({ name: "orderId" })
  order: Order;
}

@Entity()
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.products)
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  nextTimeForClearProduct: Date | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}