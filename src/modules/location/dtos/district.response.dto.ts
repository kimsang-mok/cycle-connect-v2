import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DistrictResponseDto {
  @ApiProperty({
    description: "District's code",
    example: 1204,
  })
  @Expose()
  code: number;

  @ApiProperty({ description: "District's name in Khmer", example: 'ទួលគោក' })
  @Expose()
  nameKm: string;

  @ApiProperty({
    description: "District's name in English",
    example: 'Tuol Kouk',
  })
  @Expose()
  nameEn: string;

  @ApiProperty({ description: "Province's code", example: 12 })
  @Expose()
  provinceCode: number;
}
