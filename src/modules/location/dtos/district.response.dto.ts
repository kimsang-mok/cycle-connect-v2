import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';

export class DistrictResponseDto extends ResponseBase {
  @ApiProperty({
    description: "District's code",
  })
  code: number;

  @ApiProperty({ description: "District's name in Khmer" })
  nameKm: string;

  @ApiProperty({ description: "District's name in English" })
  nameEn: string;

  @ApiProperty({ description: "Province's code" })
  provinceId: number;
}
