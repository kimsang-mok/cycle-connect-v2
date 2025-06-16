import {
  Response,
  Request,
  Inject,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { CookieServicePort } from '../../libs/cookies/cookie.service.port';
import { COOKIE_SERVICE } from '../../auth.di-tokens';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { routesV1 } from '@src/configs/app.routes';
import { JwtRefreshGuard } from '../../libs/guard/jwt-refresh-guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserResponseDto } from '../../dtos/login-user.response.dto';
import { UserMapper } from '@src/modules/user/user.mapper';
import { AuthenticateUserReturnType } from '../../domain/auth.types';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class RefreshTokenController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieServicePort,
    private readonly userMapper: UserMapper,
  ) {}

  @Post(routesV1.auth.refresh)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Refresh an access token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  async refresh(
    @Request() request: any,
    @Response({ passthrough: true }) response: ResponseType,
  ) {
    const cookiesRefreshToken = this.cookieService.checkCookie(request.cookies);

    const command = new RefreshTokenCommand({
      refreshToken: cookiesRefreshToken,
      userId: request.user.id,
    });

    const { refreshToken, user, accessToken }: AuthenticateUserReturnType =
      await this.commandBus.execute(command);

    this.cookieService.signCookie(response, refreshToken);

    return { user: this.userMapper.toResponse(user), accessToken };
  }
}
