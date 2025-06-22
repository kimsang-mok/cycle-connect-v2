import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMyBikesQuery } from './list-my-bikes.query';
import { BikeOrmEntity } from '../../database/bike.orm-entity';
import { DataSource } from 'typeorm';
import {
  FilterOperator,
  PercomputedFullTextSearchStrategy,
  QueryUtil,
  SortDirection,
} from '@src/libs/db';
import { Paginated } from '@src/libs/ddd';

@QueryHandler(ListMyBikesQuery)
export class ListMyBikesQueryHandler
  implements IQueryHandler<ListMyBikesQuery, Paginated<BikeOrmEntity>>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(query: ListMyBikesQuery): Promise<Paginated<BikeOrmEntity>> {
    const queryUtil = new QueryUtil<BikeOrmEntity>(
      this.dataSource,
      BikeOrmEntity,
    );

    const result = await queryUtil
      .search(new PercomputedFullTextSearchStrategy(), query.searchTerm)
      .filter({
        field: 'ownerId',
        operator: FilterOperator.equal,
        value: query.ownerId,
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
