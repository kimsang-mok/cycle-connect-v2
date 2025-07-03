import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';
import { Type } from 'class-transformer';

export class CreateBikeRequestDto {
  @ApiProperty({ enum: BikeTypes, example: BikeTypes.motorbike })
  @IsEnum(BikeTypes)
  type: BikeTypes;

  @ApiProperty({ example: 'Honda Wave' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 125,
    description: 'Engine CC or gear count for bicycle',
  })
  @IsNumber()
  enginePower: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: 'Lightweight, fuel efficient motorbike.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [String],
    example: ['uploads/user-123/photo1.jpg', 'uploads/user-123/photo2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  photoKeys: string[];

  @ApiProperty({
    example: 'uploads/user-123/photo1.jpg',
    description: 'Key of the image used as thumbnail',
  })
  @IsOptional()
  @IsString()
  thumbnailKey?: string;

  @ApiProperty({
    example: 1204,
    description: "District's code",
  })
  @Type(() => Number)
  @IsNumber()
  districtCode: number;
}
