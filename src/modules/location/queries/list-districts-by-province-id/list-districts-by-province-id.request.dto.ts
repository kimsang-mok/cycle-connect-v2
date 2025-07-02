import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ListDistrictsByProvinceIdRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  provinceId: number;
}
