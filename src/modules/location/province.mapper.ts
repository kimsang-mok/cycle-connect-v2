import { Injectable } from '@nestjs/common';
import { ProvinceOrmEntity } from './database/province.orm-entity';
import { ProvinceResponseDto } from './dtos/province.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProvinceMapper {
  toResponse(entity: ProvinceOrmEntity): ProvinceResponseDto {
    return plainToInstance(ProvinceResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
