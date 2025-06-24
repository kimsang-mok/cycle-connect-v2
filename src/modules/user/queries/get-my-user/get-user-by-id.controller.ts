import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserMapper } from '../../user.mapper';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '../../domain/user.types';

@Controller(routesV1.version)
@ApiTags(routesV1.user.tag)
export class GetUserByIdController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper,
  ) {}

  @Get(routesV1.auth.me)
  @Roles(UserRoles.renter, UserRoles.customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get User by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  async find(@Request() request) {
    const userId = request.user.id;
    const query = new GetUserByIdQuery({ id: userId });

    const result = await this.queryBus.execute(query);
    return this.userMapper.toResponse(result);
  }
}
