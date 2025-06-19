import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../booking.di-tokens';
import { BookingRepositoryPort } from '../../database/ports/booking.repository.port';
import { RentalPeriod } from '@src/modules/bike/domain/value-objects/rental-period.value-object';
import { BookingEntity } from '../booking.entity';

@Injectable()
export class BookingAvailabilityService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: BookingRepositoryPort,
  ) {}

  async isBikeAvailable(bikeId: string, period: RentalPeriod) {
    const bookings: BookingEntity[] =
      await this.bookingRepo.findActiveConfirmedByBikeId(bikeId, period.start);

    const overlaps = bookings.some((booking) => {
      const bPeriod = booking.getProps().period;
      const doesOverlap = bPeriod.overlaps(period);
      return doesOverlap;
    });

    return !overlaps;
  }
}
