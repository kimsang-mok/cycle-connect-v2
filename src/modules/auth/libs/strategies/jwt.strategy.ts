import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadType } from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
    });
  }

  // the reason as to why this code doesn't check if the user exits in db:
  // https://github.com/brocoders/nestjs-boilerplate/blob/main/docs/auth.md#about-jwt-strategy
  public validate(payload: JwtPayloadType): JwtPayloadType {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
