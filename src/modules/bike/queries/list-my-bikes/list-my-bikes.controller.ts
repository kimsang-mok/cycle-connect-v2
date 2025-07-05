import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { ListMyBikesRequestDto } from './list-my-bikes.request.dto';
import { ListMyBikesQuery } from './list-my-bikes.query';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BikeMapper } from '../../bike.mapper';
import { Paginated } from '@src/libs/ddd';
import { BikeOrmEntity } from '../../database/bike.orm-entity';
import { ApiOkPaginatedResponse } from '@src/libs/api/decorators';
import { BikeResponseDto } from '../../dtos/bike.response.dto';
import { PaginatedResponseDto } from '@src/libs/api';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class ListMyBikesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bikeMapper: BikeMapper,
  ) {}

  @Get(routesV1.bike.myBikes)
  @Roles(UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: "Find renter's bikes",
  })
  @ApiOkPaginatedResponse(BikeResponseDto)
  @ApiBearerAuth()
  async list(@Query() queryParams: ListMyBikesRequestDto, @Request() request) {
    const query = new ListMyBikesQuery({
      ...queryParams,
      ownerId: request.user.id,
    });

    const result: Paginated<BikeOrmEntity> = await this.queryBus.execute(query);

    return new PaginatedResponseDto({
      ...result,
      data: result.data.map((ormEntity) =>
        this.bikeMapper.toResponse(this.bikeMapper.toDomain(ormEntity), {
          groups: ['noRelations'],
        }),
      ),
    });
  }
}
