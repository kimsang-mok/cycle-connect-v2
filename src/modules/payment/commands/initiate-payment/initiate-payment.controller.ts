import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { InitiatePaymentCommand } from './initiate-payment.command';
import { InitiatePaymentRequestDto } from './initiate-payment.request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api';
import { InitiatePaymentResult } from './initiate-payment.service';
import { CannotCreateOrderError } from '../../payment.errors';
import { InitiatePaymentResponseDto } from './initiate-payment.response.dto';

@Controller(routesV1.version)
@ApiTags(routesV1.payment.tag)
export class InitiatePaymentController {
  constructor(readonly commandBus: CommandBus) {}

  @Post(routesV1.payment.createOrder)
  @ApiOperation({
    summary: 'Create payment order',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: InitiatePaymentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  async initiate(
    @Body() body: InitiatePaymentRequestDto,
  ): Promise<InitiatePaymentResponseDto> {
    const command = new InitiatePaymentCommand(body);

    const result: InitiatePaymentResult =
      await this.commandBus.execute(command);

    if (!result.success && result.error instanceof CannotCreateOrderError) {
      throw result.error;
    }

    return { paypalOrderId: result.paypalOrderId! };
  }
}
