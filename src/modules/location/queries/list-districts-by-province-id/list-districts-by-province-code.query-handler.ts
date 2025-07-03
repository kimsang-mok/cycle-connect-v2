import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDistrictsByProvinceCodeQuery } from './list-districts-by-province-code.query';
import { DistrictOrmEntity } from '../../database/district.orm-entity';
import { Inject } from '@nestjs/common';
import { DISTRICT_REPOSITORY } from '../../location.di-tokens';
import { DistrictRepositoryPort } from '../../database/ports/district.repository.port';
import { FindManyOptions } from 'typeorm';

@QueryHandler(ListDistrictsByProvinceCodeQuery)
export class ListDistrictsByProvinceCodeQueryHandler
  implements
    IQueryHandler<ListDistrictsByProvinceCodeQuery, DistrictOrmEntity[]>
{
  constructor(
    @Inject(DISTRICT_REPOSITORY)
    private readonly districtRepo: DistrictRepositoryPort,
  ) {}

  async execute(
    query: ListDistrictsByProvinceCodeQuery,
  ): Promise<DistrictOrmEntity[]> {
    const queryOptions: FindManyOptions<DistrictOrmEntity> = {
      where: { provinceCode: query.provinceCode },
    };

    const districts = await this.districtRepo.findAll(queryOptions);

    return districts;
  }
}
