import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { IdResponse } from '@src/libs/api';
import { AuthorizePaymentCommand } from './authorize-payment.command';
import { AuthorizePaymentRequestDto } from './authorize-payment.request.dto';
import { CommandBus } from '@nestjs/cqrs';

@Controller(routesV1.version)
@ApiTags(routesV1.payment.tag)
export class AuthorizePaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.payment.authorize)
  @ApiOperation({
    summary: 'Authorize payment',
    description: 'Update payment status to authorized',
  })
  @ApiResponse({
    status: 200,
    type: IdResponse,
  })
  async authorize(@Body() body: AuthorizePaymentRequestDto) {
    const command = new AuthorizePaymentCommand({
      orderId: body.orderId,
    });

    const result: string = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
