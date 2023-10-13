import {
  Entity,
  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Product } from "./product.entity";

export enum CategoryProductStatus {
  enable = "enable",
  disable = "disable"
}

@Entity()
export class CategoryProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  name: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: CategoryProductStatus,
    default: "enable"
  })
  status: CategoryProductStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
