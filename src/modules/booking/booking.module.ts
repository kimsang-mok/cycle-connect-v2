import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBookingController } from './command/create-booking/create-booking.controller';
import { CreateBookingService } from './command/create-booking/create-booking.service';
import { BookingMapper } from './booking.mapper';
import { BOOKING_REPOSITORY } from './booking.di-tokens';
import { BookingRepository } from './database/adapters/booking.repository';
import { BikeModule } from '../bike/bike.module';
import { BookingAvailabilityService } from './domain/services/booking-availability.service';
import { BookingPricingService } from './domain/services/booking-pricing.sevice';

const controllers = [CreateBookingController];

const commandHandlers: Provider[] = [CreateBookingService];

const services: Provider[] = [
  BookingAvailabilityService,
  BookingPricingService,
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
    ...mappers,
  ],
})
export class BookingModule {}
