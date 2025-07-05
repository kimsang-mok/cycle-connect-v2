import { DistrictOrmEntity } from '../../../database/district.orm-entity';
import { ProvinceOrmEntity } from '../../../database/province.orm-entity';

export class GetDistrictWithProvinceResponseDto {
  province: ProvinceOrmEntity;

  district: DistrictOrmEntity;
}
