import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';

export class ProvinceResponseDto extends ResponseBase {
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
