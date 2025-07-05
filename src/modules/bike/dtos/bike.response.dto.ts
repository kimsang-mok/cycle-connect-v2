import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api/response.base';
import { BikeTypes } from '../domain/bike.types';
import { Expose } from 'class-transformer';

export class BikeResponseDto extends ResponseBase {
  @ApiProperty({
    format: 'uuid',
    example: 'dcd93720-29a6-4937-b7a9-001a0f6c6d3f',
  })
  @Expose()
  ownerId: string;

  @ApiProperty({ enum: BikeTypes, example: BikeTypes.motorbike })
  @Expose()
  type: BikeTypes;

  @ApiProperty({ example: 'Honda Wave' })
  @Expose()
  model: string;

  @ApiProperty({
    example: 125,
    description: 'Engine CC or gear count for bicycle',
  })
  @Expose()
  enginePower: number;

  @ApiProperty({ example: 15.5 })
  @Expose()
  pricePerDay: number;

  @ApiProperty({ example: 'Lightweight, fuel efficient motorbike.' })
  @Expose()
  description: string;

  @ApiProperty({ example: true, description: 'Availability state' })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example:
      'https://bucket.s3.region.amazonaws.com/uploads/user-123/photo1.jpg',
    description: 'Public S3 URL of thumbnail image',
  })
  @Expose()
  thumbnailUrl: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://bucket.s3.region.amazonaws.com/uploads/user-123/photo1.jpg',
      'https://bucket.s3.region.amazonaws.com/uploads/user-123/photo2.jpg',
    ],
    description: 'Full S3 URLs to bike images',
  })
  @Expose()
  photoUrls: string[];

  @ApiProperty({
    example: 1204,
  })
  @Expose({ groups: ['noRelations'] })
  districtCode: number;
}
