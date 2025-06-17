import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBikeRequestDto } from './create-bike.request.dto';
import { CreateBikeCommand } from './create-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { IdResponse } from '@src/libs/api/id.response.dto';
import { routesV1 } from '@src/configs/app.routes';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
// import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { Price } from '../../domain/value-objects/price.value-object';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class CreateBikeController {
  constructor(private commandBus: CommandBus) {}

  // Todo: Update Roles Guards
  @Post(routesV1.bike.root)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new bike listing' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateBikeRequestDto })
  @ApiCreatedResponse({
    description: 'Bike created successfully',
    type: IdResponse,
  })
  async create(@Body() body: CreateBikeRequestDto) {
    // Todo: to update ownerId to the actual authenticated user ID
    const command = new CreateBikeCommand({
      ...body,
      ownerId: '65e4afb3-4f9d-42b8-8025-f64d6c87013b',
      pricePerDay: new Price(body.pricePerDay),
    });

    const result: AggregateId = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
