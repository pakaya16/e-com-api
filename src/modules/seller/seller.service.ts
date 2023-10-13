import { Injectable } from "@nestjs/common";
import { Seller } from "./entities/seller.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as md5 from "md5";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private configService: ConfigService
  ) {
  }

  async findAll(): Promise<Seller[]> {
    return this.sellerRepository.find();
  }

  async find(id: number): Promise<Seller | undefined> {
    return this.sellerRepository.findOne({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return this.sellerRepository.findOne({ where: { email } });
  }

  async findByEmailPass(email: string, password: string) {
    const hashPwd = this.configService.get<string>("HASH_PASSWORD");
    const passwordWithHash = md5(password + hashPwd);
    return this.sellerRepository.findOne({ where: { email, password: passwordWithHash } });
  }

  async create(email: string, password: string, name: string) {
    const hashPwd = this.configService.get<string>("HASH_PASSWORD");
    const status: any = "enable";
    return this.sellerRepository.save({
      email,
      password: md5(password + hashPwd),
      name,
      status
    });
  }
}
