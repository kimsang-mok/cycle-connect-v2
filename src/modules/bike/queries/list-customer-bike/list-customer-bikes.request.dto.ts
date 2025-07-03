import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';
import { PaginatedQueryRequestDto } from '@src/libs/api';
import { Type } from 'class-transformer';

export class ListCustomerBikesRequestDto extends PaginatedQueryRequestDto {
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

  @ApiProperty({
    description: "Rental's start date",
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  readonly rentalStart: Date;

  @ApiProperty({
    description: "Rental's end date",
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  readonly rentalEnd: Date;

  @ApiProperty({ description: "Province's code" })
  @ValidateIf((o) => !o.districtCode)
  @IsDefined({
    message: 'Either provinceCode or districtCode must be provided.',
  })
  @Type(() => Number)
  @IsNumber()
  readonly provinceCode: number;

  @ApiProperty({ description: "District's code" })
  @ValidateIf((o) => !o.provinceCode)
  @IsDefined({
    message: 'Either provinceCode or districtCode must be provided.',
  })
  @Type(() => Number)
  @IsNumber()
  readonly districtCode: number;
}
