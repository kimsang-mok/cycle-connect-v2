import { DistrictOrmEntity } from './database/district.orm-entity';
import { DistrictResponseDto } from './dtos/district.response.dto';

export class DistrictMapper {
  toResponse(entity: DistrictOrmEntity): DistrictResponseDto {
    const response = new DistrictResponseDto();
    response.code = entity.code;
    response.nameKm = entity.nameKm;
    response.nameEn = entity.nameEn;
    response.provinceCode = entity.provinceCode;
    return response;
  }
}
