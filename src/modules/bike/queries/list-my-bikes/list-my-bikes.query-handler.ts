import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMyBikesQuery } from './list-my-bikes.query';
import { BikeOrmEntity } from '../../database/bike.orm-entity';
import { DataSource } from 'typeorm';
import { ILikeSearchStrategy, QueryUtil } from '@src/libs/db';
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
      .search(
        new ILikeSearchStrategy(['model', 'description']),
        query.searchTerm,
      )
      .filter({
        field: 'ownerId',
        operator: '=',
        value: query.ownerId,
      })
      .filter({
        field: 'type',
        operator: '=',
        value: query.type,
      })
      .filter({
        field: 'enginePower',
        operator: '=',
        value: query.enginePower,
      })
      .filter({
        field: 'pricePerDay',
        operator: '>=',
        value: query.minPrice,
      })
      .filter({
        field: 'pricePerDay',
        operator: '<=',
        value: query.maxPrice,
      })
      .sort([{ field: 'createdAt', direction: 'DESC' }])
      .paginate({ page: query.page, limit: query.limit })
      .execute();

    return result;
  }
}
