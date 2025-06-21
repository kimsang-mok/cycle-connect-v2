import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { ListMyBikesRequestDto } from './list-my-bikes.request.dto';
import { ListMyBikesQuery } from './list-my-bikes.query';
import { PaginatedQueryRequestDto } from '@src/libs/api';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BikePaginatedResponseDto } from '../../dtos/bike.paginated.response.dto';
import { BikeMapper } from '../../bike.mapper';
import { Paginated } from '@src/libs/ddd';
import { BikeOrmEntity } from '../../database/bike.orm-entity';

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
  @ApiResponse({
    status: HttpStatus.OK,
    type: BikePaginatedResponseDto,
  })
  @ApiBearerAuth()
  async list(
    @Body() body: ListMyBikesRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
    @Request() request,
  ) {
    const query = new ListMyBikesQuery({
      ...body,
      ownerId: request.user.id,
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
