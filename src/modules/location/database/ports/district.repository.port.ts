import { OrmRepositoryPort } from '@src/libs/ports/orm.repository.port';
import { DistrictOrmEntity } from '../district.orm-entity';
import { ProvinceOrmEntity } from '../province.orm-entity';

export interface DistrictRepositoryPort
  extends OrmRepositoryPort<DistrictOrmEntity> {
  findOneByCode(code: number): Promise<DistrictOrmEntity | null>;

  findOneWithProvinceByCode(code: number): Promise<{
    district: DistrictOrmEntity;
    province: ProvinceOrmEntity;
  } | null>;
}
