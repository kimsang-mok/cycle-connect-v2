import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProvinceResponseDto {
  @ApiProperty({ description: "Province's code", example: 12 })
  @Expose()
  code: number;

  @ApiProperty({
    description: "Province's name in Khmer",
    example: 'រាជធានីភ្នំពេញ',
  })
  @Expose()
  nameKm: string;

  @ApiProperty({
    description: "Province's name in English",
    example: 'Phnom Penh',
  })
  @Expose()
  nameEn: string;
}
