import { QueryBus } from '@nestjs/cqrs';
import { ListAllProvincesQuery } from './list-all-provinces.query';
import { Controller, Get } from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkListResponse } from '@src/libs/api/decorators';
import { ProvinceResponseDto } from '../../dtos/province.response.dto';
import { ProvinceOrmEntity } from '../../database/province.orm-entity';
import { ProvinceMapper } from '../../province.mapper';

@Controller(routesV1.version)
@ApiTags(routesV1.location.tag)
export class ListAllProvincesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly provinceMapper: ProvinceMapper,
  ) {}

  @Get(routesV1.location.provinces)
  @ApiOperation({
    summary: 'List all provinces',
  })
  @ApiOkListResponse(ProvinceResponseDto)
  async list() {
    const query = new ListAllProvincesQuery();

    const provinces: ProvinceOrmEntity[] = await this.queryBus.execute(query);

    return {
      data: provinces.map((province) =>
        this.provinceMapper.toResponse(province),
      ),
    };
  }
}
