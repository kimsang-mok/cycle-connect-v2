import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponseDto {
  @ApiProperty({ description: "Province's code", example: 12 })
  code: number;

  @ApiProperty({
    description: "Province's name in Khmer",
    example: 'រាជធានីភ្នំពេញ',
  })
  nameKm: string;

  @ApiProperty({
    description: "Province's name in English",
    example: 'Phnom Penh',
  })
  nameEn: string;
}
