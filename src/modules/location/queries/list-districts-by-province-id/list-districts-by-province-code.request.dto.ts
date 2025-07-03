import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ListDistrictsByProvinceCodeRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  provinceCode: number;
}
