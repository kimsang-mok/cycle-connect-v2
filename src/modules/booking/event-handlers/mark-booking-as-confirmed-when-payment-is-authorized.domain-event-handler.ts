import { Inject } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../booking.di-tokens';
import { BookingRepositoryPort } from '../database/ports/booking.repository.port';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingNotFoundError } from '../booking.errors';
import { PaymentAuthorizedDomainEvent } from '@src/modules/payment/domain/events/payment-authorized.domain-event';

export class MarkBookingAsConfirmedWhenPaymentIsAuthorizedDomainEventHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: BookingRepositoryPort,
  ) {}

  @OnEvent(PaymentAuthorizedDomainEvent.name, {
    suppressErrors: false,
  })
  async handle(event: PaymentAuthorizedDomainEvent): Promise<any> {
    const booking = await this.bookingRepo.findOneById(event.bookingId);

    if (!booking) {
      throw new BookingNotFoundError();
    }

    booking.confirm();

    return await this.bookingRepo.update(booking);
  }
}
