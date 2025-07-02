import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ListDistrictsByProvinceIdRequestDto } from './list-districts-by-province-id.request.dto';
import { ListDistrictsByProvinceIdQuery } from './list-districts-by-province-id.query';
import { DistrictOrmEntity } from '../../database/district.orm-entity';
import { DistrictMapper } from '../../district.mapper';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkListResponse } from '@src/libs/api/decorators';
import { DistrictResponseDto } from '../../dtos/district.response.dto';

@Controller(routesV1.version)
@ApiTags(routesV1.location.tag)
export class ListDistrictsByProvinceIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly districtMapper: DistrictMapper,
  ) {}

  @Get(routesV1.location.districts)
  @ApiOperation({
    summary: 'List districts by provinceId',
  })
  @ApiOkListResponse(DistrictResponseDto)
  async list(@Query() queryParams: ListDistrictsByProvinceIdRequestDto) {
    const query = new ListDistrictsByProvinceIdQuery({
      provinceId: queryParams.provinceId,
    });

    const districts: DistrictOrmEntity[] = await this.queryBus.execute(query);

    return {
      data: districts.map((district) =>
        this.districtMapper.toResponse(district),
      ),
    };
  }
}
