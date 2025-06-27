import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CaptureFundCommand } from './capture-fund.command';
import { routesV1 } from '@src/configs/app.routes';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { RolesGuard } from '@src/modules/auth/libs/guard/roles.guard';
import { Roles } from '@src/modules/auth/roles.decorator';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { CaptureFundRequestDto } from './capture-fund.request.dto';
import { IdResponse } from '@src/libs/api';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller(routesV1.version)
@ApiTags(routesV1.payment.tag)
export class CaptureFundController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.payment.capture)
  @Roles(UserRoles.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Capture fund',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  async capture(@Body() body: CaptureFundRequestDto) {
    const command = new CaptureFundCommand({ orderId: body.orderId });

    const result = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
