import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { ResendVerificationRequestDto } from './resend-verification.request.dto';
import { ResendVerificationCommand } from './resend-verification.command';
import { UserAlreadyVerifiedError } from '../../auth.errors';
import { ApiErrorResponse } from '@src/libs/api';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class ResendVerificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.auth.resendVerification)
  @ApiOperation({
    summary: 'Resend account verification token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyVerifiedError.message,
    type: ApiErrorResponse,
  })
  async resend(@Body() body: ResendVerificationRequestDto) {
    const command = new ResendVerificationCommand({ email: body.email });

    await this.commandBus.execute(command);
  }
}
