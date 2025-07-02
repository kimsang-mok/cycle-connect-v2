import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDistrictsByProvinceIdQuery } from './list-districts-by-province-id.query';
import { DistrictOrmEntity } from '../../database/district.orm-entity';
import { Inject } from '@nestjs/common';
import { DISTRICT_REPOSITORY } from '../../location.di-tokens';
import { DistrictRepositoryPort } from '../../database/ports/district.repository.port';
import { FindManyOptions } from 'typeorm';

@QueryHandler(ListDistrictsByProvinceIdQuery)
export class ListDistrictsByProvinceIdQueryHandler
  implements IQueryHandler<ListDistrictsByProvinceIdQuery, DistrictOrmEntity[]>
{
  constructor(
    @Inject(DISTRICT_REPOSITORY)
    private readonly districtRepo: DistrictRepositoryPort,
  ) {}

  async execute(
    query: ListDistrictsByProvinceIdQuery,
  ): Promise<DistrictOrmEntity[]> {
    const queryOptions: FindManyOptions<DistrictOrmEntity> = {
      where: { provinceId: query.provinceId },
    };

    const districts = await this.districtRepo.findAll(queryOptions);

    return districts;
  }
}
