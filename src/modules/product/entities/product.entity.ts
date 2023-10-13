import {
  Entity,
  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToOne, OneToMany
} from "typeorm";
import { Seller } from "../../seller/entities/seller.entity";
import { CategoryProduct } from "./category-product.entity";
import { Cart, CartItems } from "../../user/entities/cart.entity";
import { OrderItems } from "../../user/entities/order.entity";

export enum ProductStatus {
  draft = "draft",
  enable = "enable",
  disable = "disable"
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CategoryProduct, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryProduct;

  @ManyToOne(() => Seller, (seller) => seller.products)
  @JoinColumn({ name: "sellerId" })
  seller: Seller;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sku: string;

  @Column()
  quantity: number;

  @Column()
  reserved: number;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  cost: number;

  @Column()
  limitPerCart: number;

  @Column({ type: "enum", enum: ProductStatus })
  status: ProductStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];
}
