import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  Controller,
  Post,
  Body,
  Get,
  Request
} from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { error_400, error_401 } from "../../utils/api-response-helper";
import * as jwtFn from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { RequestUserLoginDto, RequestUserRegisterDto } from "./dto/user-register.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserAuth } from "../../decorators/user-auth.decorator";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService
  ) {
  }

  @Public()
  @CustomApiResponse({
    status: 200,
    description: "user register"
  })
  @Post("/register")
  async register(@Body() body: RequestUserRegisterDto) {
    const { email, password, name } = body;
    const sellerData = await this.userService.findByEmail(email);

    if (sellerData) {
      return {
        httpStatusCode: 409,
        message: "duplicate record"
      };
    } else {
      try {
        await this.userService.create(email, password, name);
        return {
          httpStatusCode: 201
        };
      } catch (error) {
        console.error(error);
        return {
          httpStatusCode: 500
        };
      }
    }
  }

  @Public()
  @CustomApiResponse({
    status: 200,
    description: "seller login"
  })
  @Post("/login")
  async login(@Body() body: RequestUserLoginDto) {
    const { email, password } = body;
    const userData = await this.userService.findByEmailPass(email, password);

    if (userData?.id) {
      const jwt = jwtFn.sign({
        id: userData.id,
        type: "user",
        name: userData.name,
        status: userData.status
      }, this.configService.get<string>("AUTH_SECRET"));
      return {
        httpStatusCode: 200,
        data: {
          id: userData.id,
          email: userData.email,
          status: userData.status,
          name: userData.name,
          jwt
        }
      };
    }

    return error_401();
  }

  @UserAuth()
  @CustomApiResponse({
    status: 200,
    description: "get my profile detail"
  })
  @Get("/me")
  async me(@Request() request: any) {
    try {
      const userId: number = request.user.id;
      const { password, ...user } = await this.userService.find(userId);

      return {
        httpStatusCode: 200,
        data: user
      };
    } catch (error) {
      console.log("error", error);
      return error_400();
    }
  }
}
