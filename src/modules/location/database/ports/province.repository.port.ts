import { OrmRepositoryPort } from '@src/libs/ports/orm.repository.port';
import { ProvinceOrmEntity } from '../province.orm-entity';

export interface ProvinceRepositoryPort
  extends OrmRepositoryPort<ProvinceOrmEntity> {
  findOneByCode(code: number): Promise<ProvinceOrmEntity | null>;
}
