import { OrmRepositoryBase } from '@src/libs/db';
import { DistrictOrmEntity } from '../district.orm-entity';
import { DistrictRepositoryPort } from '../ports/district.repository.port';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DistrictRepository
  extends OrmRepositoryBase<DistrictOrmEntity>
  implements DistrictRepositoryPort
{
  protected readonly entityClass = DistrictOrmEntity;

  constructor() {
    super(new Logger(DistrictRepository.name));
  }
}
