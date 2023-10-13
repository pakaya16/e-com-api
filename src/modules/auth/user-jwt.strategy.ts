import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import * as JsonException from "../../exceptions/unauthorized.exception.json";
import { UserService } from "../user/user.service";

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("AUTH_SECRET")
    });
  }

  async validate(payload: any) {
    if (payload?.id) {
      if (payload.type === "user") {
        const user = await this.userService.find(payload.id);
        if (user.status === "enable") {
          return payload
        }
      }
    }

    throw new UnauthorizedException(JsonException.userBearerUnauthorized);
  }
}
