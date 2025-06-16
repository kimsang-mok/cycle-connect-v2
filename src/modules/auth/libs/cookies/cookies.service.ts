import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { CookieServicePort } from './cookie.service.port';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

@Injectable()
export class CookieService implements CookieServicePort {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  signCookie(res: Response, refreshToken: string): void {
    const maxAge =
      parseInt(
        this.configService.getOrThrow('auth.cookiesExpires', { infer: true }),
      ) *
      24 *
      60 *
      60 *
      1000;

    res.cookie('jwt', refreshToken, {
      httpOnly: true, // to prevent XSS attacts
      secure: false,
      sameSite: 'lax',
      maxAge,
    });
  }

  clearCookie(res: Response): void {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
  }

  checkCookie(cookies: { jwt?: string }): string {
    if (!cookies?.jwt) {
      throw new UnauthorizedException();
    }

    return cookies.jwt;
  }
}
