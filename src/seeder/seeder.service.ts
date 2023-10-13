// src/seeder/seeder.service.ts

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryProduct } from "../modules/product/entities/category-product.entity";

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(CategoryProduct)
    private readonly categoryProductRepository: Repository<CategoryProduct>
  ) {
  }

  async seedCategory() {
    const data = [
      {
        name: "เครื่องใช้ไฟฟ้า",
        description: "เครื่องใช้ไฟฟ้า"
      },
      {
        name: "เครื่องสำอาง",
        description: "เครื่องสำอาง"
      },
      {
        name: "ของแต่งบ้าน",
        description: "ของแต่งบ้าน"
      }
    ];

    await this.categoryProductRepository.save(data);
  }
}
