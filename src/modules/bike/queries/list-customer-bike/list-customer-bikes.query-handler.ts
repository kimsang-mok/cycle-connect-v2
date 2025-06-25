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
