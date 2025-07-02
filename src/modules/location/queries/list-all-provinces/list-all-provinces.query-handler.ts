import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListAllProvincesQuery } from './list-all-provinces.query';
import { ProvinceOrmEntity } from '../../database/province.orm-entity';
import { Inject } from '@nestjs/common';
import { PROVINCE_REPOSITORY } from '../../location.di-tokens';
import { ProvinceRepositoryPort } from '../../database/ports/province.repository.port';

@QueryHandler(ListAllProvincesQuery)
export class ListAllProvincesQueryHandler
  implements IQueryHandler<ListAllProvincesQuery, ProvinceOrmEntity[]>
{
  constructor(
    @Inject(PROVINCE_REPOSITORY)
    private readonly provinceRepo: ProvinceRepositoryPort,
  ) {}

  async execute(): Promise<ProvinceOrmEntity[]> {
    const result = await this.provinceRepo.findAll();

    return result;
  }
}
