import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { LoginUserResponseDto } from '../../dtos/login-user.response.dto';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { ApiErrorResponse } from '@src/libs/api';
import { Request as RequestType, Response as ResponseType } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { LoginUserRequestDto } from './login-user.request.dto';
import { AuthenticateUserReturnType } from '../../domain/auth.types';
import { CookieServicePort } from '../../libs/cookies/cookie.service.port';
import { COOKIE_SERVICE } from '../../auth.di-tokens';
import { UserMapper } from '@src/modules/user/user.mapper';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class LoginUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userMapper: UserMapper,
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieServicePort,
  ) {}

  @Post(routesV1.auth.login)
  @ApiOperation({
    summary: 'Login',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponse,
  })
  async login(
    @Body() body: LoginUserRequestDto,
    @Request() request: RequestType,
    @Response({ passthrough: true }) response: ResponseType,
  ) {
    const { cookies } = request;

    const command = new LoginUserCommand({ ...body, cookies });

    const { refreshToken, user, accessToken }: AuthenticateUserReturnType =
      await this.commandBus.execute(command);

    this.cookieService.signCookie(response, refreshToken);

    return { user: this.userMapper.toResponse(user), accessToken };
  }
}
