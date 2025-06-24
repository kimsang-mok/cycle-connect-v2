import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { PaginatedQueryRequestDto } from '@src/libs/api';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BikePaginatedResponseDto } from '../../dtos/bike.paginated.response.dto';
import { BikeMapper } from '../../bike.mapper';
import { Paginated } from '@src/libs/ddd';
import { ListCustomerBikesQuery } from './list-customer-bikes.query';
import { ListCustomerBikesRequestDto } from './list-customer-bikes.request.dto';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { BikeOrmEntity } from '../../database/bike.orm-entity';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class ListCustomerBikesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bikeMapper: BikeMapper,
  ) {}

  @Get(routesV1.bike.customer.available)
  @Roles(UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Find available bikes for customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BikePaginatedResponseDto,
  })
  // @ApiBearerAuth()
  async list(
    @Body() body: ListCustomerBikesRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ) {
    console.log('test');
    const query = new ListCustomerBikesQuery({
      ...body,
      ownerId: '',
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    console.log(query);

    const result: Paginated<BikeOrmEntity> = await this.queryBus.execute(query);
    console.log(result);
    return {
      ...result,
      data: result.data.map((ormEntity) =>
        this.bikeMapper.toResponse(this.bikeMapper.toDomain(ormEntity)),
      ),
    };
  }
}
