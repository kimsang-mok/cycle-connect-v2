import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ListDistrictsByProvinceIdRequestDto } from './list-districts-by-province-id.request.dto';
import { ListDistrictsByProvinceIdQuery } from './list-districts-by-province-id.query';
import { DistrictOrmEntity } from '../../database/district.orm-entity';
import { DistrictMapper } from '../../district.mapper';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkListResponse } from '@src/libs/api/decorators';
import { DistrictResponseDto } from '../../dtos/district.response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller(routesV1.version)
@ApiTags(routesV1.location.tag)
export class ListDistrictsByProvinceIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly districtMapper: DistrictMapper,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get(routesV1.location.districts)
  @ApiOperation({
    summary: 'List districts by provinceId',
  })
  @ApiOkListResponse(DistrictResponseDto)
  async list(@Query() queryParams: ListDistrictsByProvinceIdRequestDto) {
    const cacheKey = `location:districts:province:${queryParams.provinceId}`;
    const cached = await this.cacheManager.get<DistrictResponseDto[]>(cacheKey);

    if (cached) {
      return { data: cached };
    }

    const query = new ListDistrictsByProvinceIdQuery({
      provinceId: queryParams.provinceId,
    });

    const districts: DistrictOrmEntity[] = await this.queryBus.execute(query);

    const result = districts.map((district) =>
      this.districtMapper.toResponse(district),
    );

    await this.cacheManager.set(cacheKey, result, 60 * 60 * 24);

    return {
      data: result,
    };
  }
}
