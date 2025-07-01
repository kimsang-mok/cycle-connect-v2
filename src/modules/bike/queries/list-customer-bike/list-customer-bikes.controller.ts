import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BikePaginatedResponseDto } from '../../dtos/bike.paginated.response.dto';
import { BikeMapper } from '../../bike.mapper';
import { Paginated } from '@src/libs/ddd';
import { ListCustomerBikesQuery } from './list-customer-bikes.query';
import { ListCustomerBikesRequestDto } from './list-customer-bikes.request.dto';

import { BikeOrmEntity } from '../../database/bike.orm-entity';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class ListCustomerBikesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bikeMapper: BikeMapper,
  ) {}

  @Get(routesV1.bike.root)
  @ApiOperation({
    summary: 'Find available bikes for customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BikePaginatedResponseDto,
  })
  async list(@Query() queryParams: ListCustomerBikesRequestDto) {
    const query = new ListCustomerBikesQuery({
      ...queryParams,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });

    const result: Paginated<BikeOrmEntity> = await this.queryBus.execute(query);
    return {
      ...result,
      data: result.data.map((ormEntity) =>
        this.bikeMapper.toResponse(this.bikeMapper.toDomain(ormEntity)),
      ),
    };
  }
}
