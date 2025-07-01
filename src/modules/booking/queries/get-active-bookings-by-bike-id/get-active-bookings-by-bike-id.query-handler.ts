import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveBookingsByBikeIdQuery } from './get-active-bookings-by-bike-id.query';
import { FilterOperator, QueryUtil } from '@src/libs/db';
import { BookingOrmEntity } from '../../database/booking.orm-entity';
import { DataSource } from 'typeorm';
import { BookingStatus } from '../../domain/booking.types';

@QueryHandler(GetActiveBookingsByBikeIdQuery)
export class GetActiveBookingsBikeBikeIdQueryHandler
  implements IQueryHandler<GetActiveBookingsByBikeIdQuery, BookingOrmEntity[]>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    query: GetActiveBookingsByBikeIdQuery,
  ): Promise<BookingOrmEntity[]> {
    const startDate = new Date();
    const lastDayOfMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      +1,
      0,
    );

    const queryUtil = new QueryUtil<BookingOrmEntity>(
      this.dataSource,
      BookingOrmEntity,
    );

    const records = await queryUtil
      .filter({
        field: 'bikeId',
        operator: FilterOperator.equal,
        value: query.bikeId,
      })
      .filter({
        field: 'status',
        operator: FilterOperator.equal,
        value: BookingStatus.confirmed,
      })
      .filter({
        field: 'startDate',
        operator: FilterOperator.lessThanEqual,
        value: startDate,
      })
      .filter({
        field: 'endDate',
        operator: FilterOperator.greaterThanEqual,
        value: lastDayOfMonth,
      })
      .executeRaw();

    return records;
  }
}
