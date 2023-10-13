import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import * as JsonException from "../../exceptions/unauthorized.exception.json";
import { UserService } from "../user/user.service";
import { SellerService } from "../seller/seller.service";

@Injectable()
export class SellerJwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private sellerService: SellerService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("SELLER_AUTH_SECRET")
    });
  }

  async validate(payload: any) {
    if (payload?.id) {
      if (payload.type === "seller") {
        const seller = await this.sellerService.find(payload.id);
        if (seller.status === "enable") {
          return payload
        }
      }
    }

    throw new UnauthorizedException(JsonException.userBearerUnauthorized);
  }
}