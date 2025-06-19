import { SqlRepositoryBase } from '@src/libs/db';
import { BookingEntity } from '../../domain/booking.entity';
import { BookingOrmEntity } from '../booking.orm-entity';
import { BookingRepositoryPort } from '../ports/booking.repository.port';
import { BookingMapper } from '../../booking.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { BookingStatus } from '../../domain/booking.types';

export class BookingRepository
  extends SqlRepositoryBase<BookingEntity, BookingOrmEntity>
  implements BookingRepositoryPort
{
  protected readonly entityClass = BookingOrmEntity;

  constructor(mapper: BookingMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(BookingRepository.name));
  }

  async findConfirmedByBikeId(bikeId: string): Promise<BookingEntity[]> {
    const entities = await this.repository.find({
      where: { bikeId, status: BookingStatus.confirmed },
    });

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
