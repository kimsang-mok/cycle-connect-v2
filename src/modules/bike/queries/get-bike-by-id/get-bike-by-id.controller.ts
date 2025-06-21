import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { BikeMapper } from '../../bike.mapper';
import { BikeResponseDto } from '../../dtos/bike.response.dto';
import { GetBikeByIdQuery } from './get-bike-by-id.query';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class GetBikeByIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bikeMapper: BikeMapper,
  ) {}

  @Get(routesV1.bike.get)
  @ApiOperation({ summary: 'Get bike by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BikeResponseDto,
  })
  async find(@Param('id') id: string) {
    const query = new GetBikeByIdQuery({ id });

    const result = await this.queryBus.execute(query);

    return this.bikeMapper.toResponse(result);
  }
}
