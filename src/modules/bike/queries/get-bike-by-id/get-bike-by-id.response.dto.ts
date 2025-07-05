import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BikeResponseDto } from '../../dtos/bike.response.dto';
import { ProvinceResponseDto } from '@src/modules/location/dtos/province.response.dto';
import { DistrictResponseDto } from '@src/modules/location/dtos/district.response.dto';
import { Expose } from 'class-transformer';

class LocationResponseDto {
  @ApiProperty({
    type: () => ProvinceResponseDto,
  })
  @Expose()
  province: ProvinceResponseDto;

  @ApiProperty({
    type: () => DistrictResponseDto,
  })
  @Expose()
  district: DistrictResponseDto;
}

export class GetBikeByIdResponseDto extends OmitType(BikeResponseDto, [
  'districtCode',
]) {
  constructor(props: Partial<GetBikeByIdResponseDto>) {
    super();
    Object.assign(this, props);
  }

  @ApiProperty({
    type: () => LocationResponseDto,
  })
  @Expose()
  location: LocationResponseDto;
}
