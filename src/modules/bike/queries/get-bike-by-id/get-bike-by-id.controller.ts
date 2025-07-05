/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { BikeMapper } from '../../bike.mapper';
import { GetBikeByIdQuery } from './get-bike-by-id.query';
import { GetBikeByIdResponseDto } from './get-bike-by-id.response.dto';
import { GetBikeByIdQueryResult } from './get-bike-by-id.query-handler';
import { ProvinceMapper } from '@src/modules/location/province.mapper';
import { DistrictMapper } from '@src/modules/location/district.mapper';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class GetBikeByIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bikeMapper: BikeMapper,
    private readonly provinceMapper: ProvinceMapper,
    private readonly districtMapper: DistrictMapper,
  ) {}

  @Get(routesV1.bike.get)
  @ApiOperation({ summary: 'Get bike by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBikeByIdResponseDto,
  })
  async find(@Param('id') id: string) {
    const query = new GetBikeByIdQuery({ id });

    const result: GetBikeByIdQueryResult = await this.queryBus.execute(query);

    return new GetBikeByIdResponseDto({
      ...this.bikeMapper.toResponse(result.bike),
      location: {
        province: this.provinceMapper.toResponse(result.location.province),
        district: this.districtMapper.toResponse(result.location.district),
      },
    });
  }
}
