import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from './create-booking.command';
import { AggregateId } from '@src/libs/ddd';
import { Inject } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../booking.di-tokens';
import { BookingRepositoryPort } from '../../database/ports/booking.repository.port';
import { RentalPeriod } from '@src/modules/bike/domain/value-objects/rental-period.value-object';
import { BIKE_REPOSITORY } from '@src/modules/bike/bike.di-tokens';
import { BikeRepositoryPort } from '@src/modules/bike/database/ports/bike.repository.port';
import { BookingAvailabilityService } from '../../domain/services/booking-availability.service';
import {
  BikeNotAvailableError,
  BikeNotFoundError,
} from '@src/modules/bike/bike.errors';
import { BookingPricingService } from '../../domain/services/booking-pricing.sevice';
import { BookingEntity } from '../../domain/booking.entity';
import { Transactional } from '@src/libs/application/decorators';

@CommandHandler(CreateBookingCommand)
export class CreateBookingService
  implements ICommandHandler<CreateBookingCommand, AggregateId>
{
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: BookingRepositoryPort,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
    private readonly availabilityService: BookingAvailabilityService,

    private readonly pricingService: BookingPricingService,
  ) {}

  @Transactional()
  async execute(command: CreateBookingCommand): Promise<string> {
    const period = new RentalPeriod({
      start: new Date(command.startDate),
      end: new Date(command.endDate),
    });

    const bike = await this.bikeRepo.findOneById(command.bikeId);

    if (!bike) {
      throw new BikeNotFoundError();
    }

    if (!bike.getProps().isActive) {
      throw new BikeNotAvailableError();
    }

    const isBikeAvailable = await this.availabilityService.isBikeAvailable(
      command.bikeId,
      period,
    );

    if (!isBikeAvailable) {
      throw new BikeNotAvailableError();
    }

    const totalPrice = this.pricingService.calculateTotalPrice(
      bike.getProps().pricePerDay,
      period,
    );

    const booking = BookingEntity.create({
      bikeId: command.bikeId,
      customerName: command.customerName,
      period,
      totalPrice,
    });

    await this.bookingRepo.insert(booking);
    return booking.id;
  }
}
