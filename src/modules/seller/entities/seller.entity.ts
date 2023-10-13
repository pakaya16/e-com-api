import {
  Entity, PrimaryGeneratedColumn,
  Column, OneToMany, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Product } from "../../product/entities/product.entity";

export enum SellerStatus {
  enable = "enable",
  disable = "disable"
}

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({ type: "enum", enum: SellerStatus })
  status: SellerStatus;

  @Column()
  password: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
