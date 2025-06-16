import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Patch,
  Response,
} from '@nestjs/common';
import { VerifyAccountRequestDto } from './verify-account.request.dto';
import { VerifyAccountCommand } from './verify-account.command';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from '@src/configs/app.routes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserResponseDto } from '../../dtos/login-user.response.dto';
import { AuthenticateUserReturnType } from '../../domain/auth.types';
import { CookieServicePort } from '../../libs/cookies/cookie.service.port';
import { COOKIE_SERVICE } from '../../auth.di-tokens';
import { UserMapper } from '@src/modules/user/user.mapper';
import { Response as ResponseType } from 'express';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class VerifyAccountController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieServicePort,
    private readonly userMapper: UserMapper,
  ) {}

  @Patch(routesV1.auth.verify)
  @ApiOperation({
    summary: 'Verify an account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  async verify(
    @Body() body: VerifyAccountRequestDto,
    @Response({ passthrough: true }) response: ResponseType,
  ) {
    const command = new VerifyAccountCommand({
      token: body.token,
    });

    const { refreshToken, user, accessToken }: AuthenticateUserReturnType =
      await this.commandBus.execute(command);

    this.cookieService.signCookie(response, refreshToken);

    return { user: this.userMapper.toResponse(user), accessToken };
  }
}
