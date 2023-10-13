import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {
  }

  async find(id: number, status: any = 'enable') {
    return await this.productRepository.findOne({
      where: {
        id, status
      }
    });
  }

  async findWithSeller(id: number, sellerId: any) {
    return await this.productRepository.findOne({
      where: {
        id, seller: sellerId
      }
    });
  }

  async create({ sellerId, categoryId, name, description, sku, quantity, price, limitPerCart, cost }) {
    const productData = await this.productRepository.findOne({
      where: {
        sku, seller: sellerId
      }
    });

    if (productData?.id) {
      return false;
    } else {
      const status: any = "enable";
      return await this.productRepository.save({
        cost,
        seller: sellerId,
        category: categoryId,
        name,
        description,
        sku,
        quantity,
        reserved: 0,
        stock: quantity,
        price,
        limitPerCart,
        status
      });
    }
  }

  async update(productId: number, data: any) {
    return await this.productRepository.update(productId, data);
  }

  async findBySkuWithSeller(sku: string, sellerId: any) {
    return await this.productRepository.findOne({
      where: {
        sku, seller: sellerId
      }
    });
  }

  async delete(productId: number) {
    return await this.productRepository.delete(productId);
  }

  async findByConditionPagination(condition: any, page: number = 1, limit: number = 10) {
    const status: any = "enable";
    return await this.productRepository
      .findAndCount({
        where: {
          ...condition,
          status
        },
        relations: ['category', 'seller'],
        skip: (page - 1) * limit,
        take: limit
      });
  }

  async findALlPagination(page: number = 1, limit: number = 10) {
    const status: any = "enable";
    return await this.productRepository
      .findAndCount({
        where: {
          status
        },
        relations: ['category', 'seller'],
        skip: (page - 1) * limit,
        take: limit
      });
  }
}
