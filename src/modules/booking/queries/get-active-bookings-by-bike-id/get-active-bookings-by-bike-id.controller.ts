import { Controller, Get, HttpStatus, Param } from '@nestjs/common';

import { GetActiveBookingsByBikeIdQuery } from './get-active-bookings-by-bike-id.query';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { BookingMapper } from '../../booking.mapper';
import { BookingOrmEntity } from '../../database/booking.orm-entity';
import { GetActiveBookingsByBikeIdResponseDto } from './get-active-bookings-by-bike-id.response.dto';

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
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetActiveBookingsByBikeIdResponseDto,
  })
  async get(@Param('bikeId') bikeId: string) {
    const query = new GetActiveBookingsByBikeIdQuery({ bikeId });

    console.log('Bike Id: ', bikeId);

    const records: BookingOrmEntity[] = await this.queryBus.execute(query);

    return {
      data: records.map((record) =>
        this.bookingMapper.toResponse(this.bookingMapper.toDomain(record)),
      ),
    };
  }
}
