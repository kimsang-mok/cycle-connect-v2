import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBookingRequestDto } from './create-booking.request.dto';
import { routesV1 } from '@src/configs/app.routes';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { CreateBookingCommand } from './create-booking.command';
import {
  BikeInactiveError,
  BikeNotAvailableError,
  BikeNotFoundError,
} from '@src/modules/bike/bike.errors';

@Controller(routesV1.version)
@ApiTags(routesV1.booking.tag)
export class CreateBookingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.booking.root)
  @ApiOperation({ summary: 'Book a bike' })
  @ApiBody({
    type: CreateBookingRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Booking created successfully',
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BikeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BikeNotAvailableError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BikeInactiveError.message,
    type: ApiErrorResponse,
  })
  async create(@Body() body: CreateBookingRequestDto) {
    const command = new CreateBookingCommand(body);

    const result: string = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
