import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AllConfigType } from '@src/configs/config.type';
import { UserEntity } from '@src/modules/user/domain/user.entity';
import { SessionService } from './session.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserVerificationRepositoryPort } from '../database/ports/user-verification.repository.port';
import { USER_VERIFICATION_REPOSITORY } from '../auth.di-tokens';
import { VerificationStatus } from '../domain/auth.types';
import { AccountNotVerifiedError } from '../auth.errors';
import { USER_REPOSITORY } from '@src/modules/user/user.di-tokens';
import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { UserNotFoundError } from '@src/modules/user/user.errors';

@Injectable()
export class AuthenticateUserService {
  private readonly logger = new Logger(AuthenticateUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findOneById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async execute({
    cookies,
    user,
  }: {
    cookies: { jwt?: string };
    user: UserEntity;
  }) {
    const verification = await this.userVerificationRepo.findOneByUserId(
      user.id,
    );

    if (verification.getProps().status === VerificationStatus.pending) {
      throw new AccountNotVerifiedError();
    }

    const { accessToken, refreshToken } = await this.getTokensData({
      id: user.id,
      role: user.role,
    });

    if (cookies?.jwt) {
      /**
       * if cookies contains jwt, and the jwt has been stored in Session table,
       * delete that session and create a new one
       */
      await this.sessionService.deleteByRefreshToken({
        refreshToken: cookies.jwt,
      });
    }

    await this.sessionService.create({
      userId: user.id,
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async getTokensData({
    id,
    role,
  }: {
    id: UserEntity['id'];
    role: UserEntity['role'];
  }) {
    const tokenExpiresIn = this.configService.get('auth.expires', {
      infer: true,
    });

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: id,
          role: role,
        },
        {
          secret: this.configService.get('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),

      await this.jwtService.signAsync(
        {
          id: id,
        },
        {
          secret: this.configService.get('auth.refreshSecret', { infer: true }),
          expiresIn: this.configService.get('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
