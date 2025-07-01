import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';
import { PaginatedQueryRequestDto } from '@src/libs/api';
import { Type } from 'class-transformer';

export class ListMyBikesRequestDto extends PaginatedQueryRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly searchTerm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BikeTypes)
  readonly type?: BikeTypes;

  @ApiPropertyOptional({
    example: 125,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly enginePower?: number;

  @ApiPropertyOptional({
    description: 'Lowest rental price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly minPrice?: number;

  @ApiPropertyOptional({
    description: 'Highest rental price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly maxPrice?: number;
}
