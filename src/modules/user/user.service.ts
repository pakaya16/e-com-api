import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as md5 from "md5";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) {
  }

  async find(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailPass(email: string, password: string) {
    const hashPwd = this.configService.get<string>("HASH_PASSWORD");
    const passwordWithHash = md5(password + hashPwd);
    return this.userRepository.findOne({ where: { email, password: passwordWithHash } });
  }

  async create(email: string, password: string, name: string) {
    const hashPwd = this.configService.get<string>("HASH_PASSWORD");
    const status: any = "enable";
    return this.userRepository.save({
      email,
      password: md5(password + hashPwd),
      name,
      status
    });
  }
}
