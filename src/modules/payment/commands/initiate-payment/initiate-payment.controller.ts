import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { InitiatePaymentCommand } from './initiate-payment.command';
import { InitiatePaymentRequestDto } from './initiate-payment.request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdResponse } from '@src/libs/api';

@Controller(routesV1.version)
@ApiTags(routesV1.payment.tag)
export class InitiatePaymentController {
  constructor(readonly commandBus: CommandBus) {}

  @Post(routesV1.payment.root)
  @ApiOperation({
    summary: 'Authorize payment',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  async initiate(@Body() body: InitiatePaymentRequestDto) {
    const command = new InitiatePaymentCommand(body);

    const result = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
