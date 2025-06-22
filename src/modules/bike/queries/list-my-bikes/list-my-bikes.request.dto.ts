import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';

export class ListMyBikesRequestDto {
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
  @IsNumber()
  readonly enginePower?: number;

  @ApiProperty({
    description: 'Lowest rental price',
  })
  @IsOptional()
  @IsNumber()
  readonly minPrice?: number;

  @ApiProperty({
    description: 'Highest rental price',
  })
  @IsOptional()
  @IsNumber()
  readonly maxPrice?: number;
}
