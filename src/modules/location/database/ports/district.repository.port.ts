/* eslint-disable @typescript-eslint/no-empty-object-type */
import { OrmRepositoryPort } from '@src/libs/ports/orm.repository.port';
import { DistrictOrmEntity } from '../district.orm-entity';

export interface DistrictRepositoryPort
  extends OrmRepositoryPort<DistrictOrmEntity> {}
