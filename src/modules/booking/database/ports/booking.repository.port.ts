import { RepositoryPort } from '@src/libs/ddd';
import { BookingEntity } from '../../domain/booking.entity';

export interface BookingRepositoryPort extends RepositoryPort<BookingEntity> {
  findActiveConfirmedByBikeId(
    bikeId: string,
    fromDate: Date,
  ): Promise<BookingEntity[]>;
}
