import { OrmRepositoryBase } from '@src/libs/db';
import { DistrictOrmEntity } from '../district.orm-entity';
import { DistrictRepositoryPort } from '../ports/district.repository.port';
import { Injectable, Logger } from '@nestjs/common';
import { ProvinceOrmEntity } from '../province.orm-entity';

@Injectable()
export class DistrictRepository
  extends OrmRepositoryBase<DistrictOrmEntity>
  implements DistrictRepositoryPort
{
  protected readonly entityClass = DistrictOrmEntity;

  constructor() {
    super(new Logger(DistrictRepository.name));
  }

  async findOneByCode(code: number): Promise<DistrictOrmEntity | null> {
    const result = await this.repository.findOne({ where: { code } });

    return result ?? null;
  }

  async findOneWithProvinceByCode(code: number): Promise<{
    district: DistrictOrmEntity;
    province: ProvinceOrmEntity;
  } | null> {
    const result = await this.repository
      .createQueryBuilder('district')
      .leftJoinAndSelect('district.province', 'province')
      .where('district.code = :code', { code })
      .getOne();

    if (!result || !result.province) return null;

    return {
      district: result,
      province: result.province,
    };
  }
}
