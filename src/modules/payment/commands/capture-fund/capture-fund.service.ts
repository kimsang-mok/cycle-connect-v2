import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CaptureFundCommand } from './capture-fund.command';
import { Inject } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { BOOKING_REPOSITORY } from '@src/modules/booking/booking.di-tokens';
import { BookingRepositoryPort } from '@src/modules/booking/database/ports/booking.repository.port';
import {
  CannotCaptureFundError,
  CannotCaptureUnAuthorizedPaymentError,
  CannotChargeUnconfirmedBookingError,
  PaymentNotFoundError,
} from '../../payment.errors';
import { PaymentStatusType } from '../../domain/payment.types';
import { BookingStatus } from '@src/modules/booking/domain/booking.types';
import { BookingNotFoundError } from '@src/modules/booking/booking.errors';
import { PAYMENT_GATEWAY } from '@src/libs/payment-gateway/payment-gateway.di-tokens';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { Transactional } from '@src/libs/application/decorators';

@CommandHandler(CaptureFundCommand)
export class CaptureFundService
  implements ICommandHandler<CaptureFundCommand, string>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: BookingRepositoryPort,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGatewayServicePort,
  ) {}

  @Transactional()
  async execute(command: CaptureFundCommand): Promise<string> {
    const payment = await this.paymentRepo.findOneByOrderId(command.orderId);

    let bookingStatus: BookingStatus | undefined = command.bookingStatus;

    if (!payment) {
      throw new PaymentNotFoundError();
    }

    if (!payment.getProps().status.is(PaymentStatusType.authorized)) {
      throw new CannotCaptureUnAuthorizedPaymentError();
    }

    if (!command.bookingStatus) {
      const booking = await this.bookingRepo.findOneById(
        payment.getProps().bookingId,
      );

      if (!booking) {
        throw new BookingNotFoundError();
      }

      bookingStatus = booking.getProps().status;
    }

    if (bookingStatus !== BookingStatus.confirmed) {
      throw new CannotChargeUnconfirmedBookingError();
    }

    const result = await this.gateway.capture({
      authorizationId: payment.getProps().authorizationId!,
      amount: Number(payment.getProps().amount.unpack()),
    });

    if (!result.success && !result.transactionId) {
      throw new CannotCaptureFundError();
    }

    payment.markSucceeded();
    await this.paymentRepo.update(payment);

    return payment.id;
  }
}
