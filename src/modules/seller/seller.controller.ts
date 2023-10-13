import { SellerService } from "./seller.service";
import { ApiTags } from "@nestjs/swagger";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  RequestSellerLoginDto,
  RequestSellerRegisterDto
} from "./dto/seller-register.dto";
import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  ValidationPipe
} from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { error_400, error_401 } from "../../utils/api-response-helper";
import * as jwtFn from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { Seller } from "./entities/seller.entity";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SellerAuth } from "../../decorators/seller-auth.decorator";

@ApiTags("Seller")
@Controller("seller")
export class SellerController {
  constructor(
    private sellerService: SellerService,
    private configService: ConfigService
  ) {
  }

  @Public()
  @CustomApiResponse({
    status: 200,
    description: "seller register"
  })
  @Post("/register")
  async register(@Body(ValidationPipe) body: RequestSellerRegisterDto) {
    const { email, password, name } = body;
    await this.sellerService.create(email, password, name);
    return {
      httpStatusCode: 201
    };
  }

  @Public()
  @CustomApiResponse({
    status: 200,
    description: "seller login"
  })
  @Post("/login")
  async login(@Body() body: RequestSellerLoginDto) {
    const { email, password } = body;
    const sellerData = await this.sellerService.findByEmailPass(email, password);

    if (sellerData?.id) {
      const jwt = jwtFn.sign({
        id: sellerData.id,
        name: sellerData.name,
        type: "seller",
        status: sellerData.status
      }, this.configService.get<string>("SELLER_AUTH_SECRET"));
      return {
        httpStatusCode: 200,
        data: {
          id: sellerData.id,
          name: sellerData.name,
          email: sellerData.email,
          status: sellerData.status,
          jwt
        }
      };
    }

    return error_401();
  }

  @SellerAuth()
  @CustomApiResponse({
    status: 200,
    description: "get my seller profile detail"
  })
  @Get("/me")
  async me(@Request() request: any) {
    try {
      const sellerId: number = request.user.id;
      const { password, ...seller } = await this.sellerService.find(sellerId);
      return {
        httpStatusCode: 200,
        data: seller
      };
    } catch (error) {
      console.log("error", error);
      return error_400();
    }
  }
}
