import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CustomApiResponse } from "../../decorators/api-docs-response.decorator";
import {
  Controller,
  Post,
  Body
} from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { PaymentService } from "./payment.service";
import { WebhookCallbackDto } from "./dto/webhook.dto";

@Public()
@ApiTags("Webhook")
@Controller("payment/callback")
export class PaymentWebhookController {
  constructor(
    private paymentService: PaymentService,
    private configService: ConfigService
  ) {
  }

  @CustomApiResponse({
    status: 200,
    description: "for payment third party callback"
  })
  @ApiOperation({
    summary: "this api will call by third party payment webhook, exp set this link in 2c2p webhook"
  })
  @Post("/")
  async paymentCall(@Body() body: WebhookCallbackDto) {
    // log payment callback
    const paymentLog = await this.paymentService.create(body);
    // example success case
    const paymentLogId = paymentLog.id;
    await this.paymentService.successCase(paymentLogId);

    return {
      httpStatusCode: 200
    };
  }
}
