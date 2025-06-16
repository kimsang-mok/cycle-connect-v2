import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { JwtRefreshPayloadType } from './types/jwt-refresh-payload';

import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: (request: Request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['jwt'];
        }

        return token;
      },
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }
  public validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
