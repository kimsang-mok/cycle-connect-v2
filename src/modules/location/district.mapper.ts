import { plainToInstance } from 'class-transformer';
import { DistrictOrmEntity } from './database/district.orm-entity';
import { DistrictResponseDto } from './dtos/district.response.dto';

export class DistrictMapper {
  toResponse(entity: DistrictOrmEntity): DistrictResponseDto {
    return plainToInstance(DistrictResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
