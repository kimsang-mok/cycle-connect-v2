import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';
import { PaginatedQueryRequestDto } from '@src/libs/api';
import { Type } from 'class-transformer';

export class ListCustomerBikesRequestDto extends PaginatedQueryRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly searchTerm?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BikeTypes)
  readonly type?: BikeTypes;

  @ApiProperty({
    example: 125,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly enginePower?: number;

  @ApiProperty({
    description: 'Lowest rental price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly minPrice?: number;

  @ApiProperty({
    description: 'Highest rental price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly maxPrice?: number;
}
