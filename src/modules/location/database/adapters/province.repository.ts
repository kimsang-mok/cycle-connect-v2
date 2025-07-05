import { OrmRepositoryBase } from '@src/libs/db';
import { ProvinceRepositoryPort } from '../ports/province.repository.port';
import { ProvinceOrmEntity } from '../province.orm-entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProvinceRepository
  extends OrmRepositoryBase<ProvinceOrmEntity>
  implements ProvinceRepositoryPort
{
  protected readonly entityClass = ProvinceOrmEntity;

  constructor() {
    super(new Logger(ProvinceRepository.name));
  }

  async findOneByCode(code: number): Promise<ProvinceOrmEntity | null> {
    const result = await this.repository.findOne({ where: { code } });

    return result ?? null;
  }
}
