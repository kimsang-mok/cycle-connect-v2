import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BikeOrmEntity } from '../../database/bike.orm-entity';
import { DataSource } from 'typeorm';
import {
  FilterOperator,
  PrecomputedFullTextSearchStrategy,
  QueryUtil,
  SortDirection,
} from '@src/libs/db';
import { Paginated } from '@src/libs/ddd';
import { ListCustomerBikesQuery } from './list-customer-bikes.query';
import { BookingStatus } from '@src/modules/booking/domain/booking.types';

@QueryHandler(ListCustomerBikesQuery)
export class ListCustomerBikesQueryHandler
  implements IQueryHandler<ListCustomerBikesQuery, Paginated<BikeOrmEntity>>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    query: ListCustomerBikesQuery,
  ): Promise<Paginated<BikeOrmEntity>> {
    const queryUtil = new QueryUtil<BikeOrmEntity>(
      this.dataSource,
      BikeOrmEntity,
    );

    const result = await queryUtil
      .custom((qb) => {
        if (query.rentalStart && query.rentalEnd) {
          qb.andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('1')
              .from('bookings', 'booking')
              .where('booking.bike_id = entity.id')
              .andWhere('booking.status = :status', {
                status: BookingStatus.confirmed,
              })
              .andWhere('booking.start_date <= :rentalEnd', {
                rentalEnd: query.rentalEnd,
              })
              .andWhere('booking.end_date >= :rentalStart', {
                rentalStart: query.rentalStart,
              })
              .getQuery();

            return `NOT EXISTS ${subQuery}`;
          });
        }
      })
      .search(new PrecomputedFullTextSearchStrategy(), query.searchTerm)
      .filter({
        field: 'isActive',
        operator: FilterOperator.equal,
        value: true,
      })
      .filter({
        field: 'type',
        operator: FilterOperator.equal,
        value: query.type,
      })
      .filter({
        field: 'enginePower',
        operator: FilterOperator.equal,
        value: query.enginePower,
      })
      .filter({
        field: 'pricePerDay',
        operator: FilterOperator.greaterThanEqual,
        value: query.minPrice,
      })
      .filter({
        field: 'pricePerDay',
        operator: FilterOperator.lessThanEqual,
        value: query.maxPrice,
      })
      .sort([{ field: 'createdAt', direction: SortDirection.desc }])
      .paginate({ page: query.page, limit: query.limit })
      .execute();

    return result;
  }
}
