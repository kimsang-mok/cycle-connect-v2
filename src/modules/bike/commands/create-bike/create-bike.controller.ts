import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { Roles } from '@src/modules/auth/roles.decorator';

@Controller(routesV1.version)
@ApiTags(routesV1.bike.tag)
export class CreateBikeController {
  constructor(private commandBus: CommandBus) {}

  @Post(routesV1.bike.root)
  @Roles(UserRoles.admin, UserRoles.renter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new bike listing' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateBikeRequestDto })
  @ApiCreatedResponse({
    description: 'Bike created successfully',
    type: IdResponse,
  })
  async create(@Body() body: CreateBikeRequestDto, @Request() request) {
    const command = new CreateBikeCommand({
      ...body,
      ownerId: request.user.id,
    });

    const result: AggregateId = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
