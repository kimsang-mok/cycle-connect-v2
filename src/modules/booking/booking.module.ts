import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBookingController } from './commands/create-booking/create-booking.controller';
import { CreateBookingService } from './commands/create-booking/create-booking.service';
import { BookingMapper } from './booking.mapper';
import { BOOKING_REPOSITORY } from './booking.di-tokens';
import { BookingRepository } from './database/adapters/booking.repository';
import { BikeModule } from '../bike/bike.module';
import { BookingAvailabilityService } from './domain/services/booking-availability.service';
import { BookingPricingService } from './domain/services/booking-pricing.sevice';
import { MarkBookingAsConfirmedWhenPaymentIsAuthorizedDomainEventHandler } from './event-handlers/mark-booking-as-confirmed-when-payment-is-authorized.domain-event-handler';

const controllers = [CreateBookingController];

const commandHandlers: Provider[] = [CreateBookingService];

const services: Provider[] = [
  BookingAvailabilityService,
  BookingPricingService,
];

const eventHandlers: Provider[] = [
  MarkBookingAsConfirmedWhenPaymentIsAuthorizedDomainEventHandler,
];

const mappers: Provider[] = [BookingMapper];

const repositories: Provider[] = [
  {
    provide: BOOKING_REPOSITORY,
    useClass: BookingRepository,
  },
];

@Module({
  imports: [CqrsModule, BikeModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...services,
    ...eventHandlers,
    ...mappers,
  ],
  exports: [BOOKING_REPOSITORY],
})
export class BookingModule {}
