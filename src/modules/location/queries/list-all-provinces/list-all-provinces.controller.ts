import { QueryBus } from '@nestjs/cqrs';
import { ListAllProvincesQuery } from './list-all-provinces.query';
import { Controller, Get, Inject } from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkListResponse } from '@src/libs/api/decorators';
import { ProvinceResponseDto } from '../../dtos/province.response.dto';
import { ProvinceOrmEntity } from '../../database/province.orm-entity';
import { ProvinceMapper } from '../../province.mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller(routesV1.version)
@ApiTags(routesV1.location.tag)
export class ListAllProvincesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly provinceMapper: ProvinceMapper,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get(routesV1.location.provinces)
  @ApiOperation({
    summary: 'List all provinces',
  })
  @ApiOkListResponse(ProvinceResponseDto)
  async list() {
    const cacheKey = 'location:provinces:all';
    const cached = await this.cacheManager.get<ProvinceResponseDto[]>(cacheKey);

    if (cached) {
      return { data: cached };
    }

    const query = new ListAllProvincesQuery();

    const provinces: ProvinceOrmEntity[] = await this.queryBus.execute(query);

    const result = provinces.map((province) =>
      this.provinceMapper.toResponse(province),
    );

    await this.cacheManager.set(cacheKey, result, 60 * 60 * 24);

    return { data: result };
  }
}
