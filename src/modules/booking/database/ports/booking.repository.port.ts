import { RepositoryPort } from '@src/libs/ddd';
import { BookingEntity } from '../../domain/booking.entity';

export interface BookingRepositoryPort extends RepositoryPort<BookingEntity> {
  findConfirmedByBikeId(bikeId: string): Promise<BookingEntity[]>;
}
