import { ApiProperty } from '@nestjs/swagger';

export class DistrictResponseDto {
  @ApiProperty({
    description: "District's code",
    example: 1204,
  })
  code: number;

  @ApiProperty({ description: "District's name in Khmer", example: 'ទួលគោក' })
  nameKm: string;

  @ApiProperty({
    description: "District's name in English",
    example: 'Tuol Kouk',
  })
  nameEn: string;

  @ApiProperty({ description: "Province's code", example: 12 })
  provinceCode: number;
}
