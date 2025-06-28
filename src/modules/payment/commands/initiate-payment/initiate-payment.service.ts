import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitiatePaymentCommand } from './initiate-payment.command';
import { PaymentEntity } from '../../domain/payment.entity';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { Inject } from '@nestjs/common';
import { PAYMENT_GATEWAY } from '@src/libs/payment-gateway/payment-gateway.di-tokens';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { Transactional } from '@src/libs/application/decorators';
import { BookingRepositoryPort } from '@src/modules/booking/database/ports/booking.repository.port';
import { BOOKING_REPOSITORY } from '@src/modules/booking/booking.di-tokens';
import { BookingNotFoundError } from '@src/modules/booking/booking.errors';
import {
  CannotCreateOrderError,
  InvalidPaymentAmountError,
} from '../../payment.errors';

export type InitiatePaymentResult =
  | { success: true; paypalOrderId: string }
  | {
      success: false;
      paypalOrderId: undefined;
      error: InstanceType<typeof CannotCreateOrderError>;
    };

@CommandHandler(InitiatePaymentCommand)
export class InitiatePaymentService
  implements ICommandHandler<InitiatePaymentCommand, InitiatePaymentResult>
{
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGatewayServicePort,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: BookingRepositoryPort,
  ) {}

  @Transactional()
  async execute(
    command: InitiatePaymentCommand,
  ): Promise<InitiatePaymentResult> {
    const booking = await this.bookingRepo.findOneById(command.bookingId);

    if (!booking) {
      throw new BookingNotFoundError();
    }

    const existingPayment = await this.paymentRepo.findOneByBookingId(
      booking.id,
    );

    if (existingPayment) {
      return {
        success: true,
        paypalOrderId: existingPayment.getProps().orderId,
      };
    }

    if (Number(booking.getProps().totalPrice.unpack()) !== command.amount) {
      throw new InvalidPaymentAmountError();
    }

    const payment = PaymentEntity.create({
      ...command,
      amount: new Price(command.amount),
    });

    const result = await this.gateway.createOrder({
      orderId: command.bookingId,
      amount: command.amount,
      method: command.method,
    });

    if (result.success && result.paypalOrderId) {
      payment.markPending(result.paypalOrderId);
      await this.paymentRepo.insert(payment);
    }

    return result.paypalOrderId
      ? { success: true, paypalOrderId: result.paypalOrderId }
      : {
          success: false,
          paypalOrderId: undefined,
          error: new CannotCreateOrderError(),
        };
  }
}
