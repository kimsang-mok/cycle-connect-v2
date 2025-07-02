import { Injectable } from '@nestjs/common';
import { ProvinceOrmEntity } from './database/province.orm-entity';
import { ProvinceResponseDto } from './dtos/province.response.dto';

@Injectable()
export class ProvinceMapper {
  toResponse(entity: ProvinceOrmEntity): ProvinceResponseDto {
    const response = new ProvinceResponseDto(entity);
    response.code = entity.code;
    response.nameKm = entity.nameKm;
    response.nameEn = entity.nameEn;
    return response;
  }
}
