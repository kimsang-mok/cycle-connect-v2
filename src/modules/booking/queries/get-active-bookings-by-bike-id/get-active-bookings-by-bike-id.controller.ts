import { Controller, Get, Param } from '@nestjs/common';

import { GetActiveBookingsByBikeIdQuery } from './get-active-bookings-by-bike-id.query';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { BookingMapper } from '../../booking.mapper';
import { BookingOrmEntity } from '../../database/booking.orm-entity';
import { ApiOkListResponse } from '@src/libs/api/decorators/api-ok-list-response.decorator';
import { BookingResponseDto } from '../../dtos/booking.response.dto';
import { ListResponseDto } from '@src/libs/api';

@Controller(routesV1.version)
@ApiTags(routesV1.booking.tag)
export class GetActiveBookingsBikeBikeIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bookingMapper: BookingMapper,
  ) {}

  @Get(routesV1.booking.byBike)
  @ApiOperation({
    summary: 'Retrieve all active bookings by bike id for the current month',
  })
  @ApiOkListResponse(BookingResponseDto)
  async get(@Param('bikeId') bikeId: string) {
    const query = new GetActiveBookingsByBikeIdQuery({ bikeId });

    const records: BookingOrmEntity[] = await this.queryBus.execute(query);

    return new ListResponseDto(
      records.map((record) =>
        this.bookingMapper.toResponse(this.bookingMapper.toDomain(record)),
      ),
    );
  }
}
