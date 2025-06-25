import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendVerificationCommand } from './resend-verification.command';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@src/modules/user/user.di-tokens';
import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { USER_VERIFICATION_REPOSITORY } from '../../auth.di-tokens';
import { UserVerificationRepositoryPort } from '../../database/ports/user-verification.repository.port';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { JwtService } from '@nestjs/jwt';
import { VerificationStatus } from '../../domain/auth.types';
import { UserAlreadyVerifiedError } from '../../auth.errors';

@CommandHandler(ResendVerificationCommand)
export class ResendVerificationService
  implements ICommandHandler<ResendVerificationCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: ResendVerificationCommand): Promise<void> {
    const user = await this.userRepo.findOneByEmail(command.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const verification = await this.userVerificationRepo.findOneByUserId(
      user.id,
    );

    if (verification.getProps().status === VerificationStatus.verified) {
      throw new UserAlreadyVerifiedError();
    }

    const token = await this.jwtService.signAsync(
      { confirmEmailUserId: verification.getProps().userId },
      {
        secret: this.configService.get('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.get('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    verification.updateToken(token, user.getProps().email.unpack());

    await this.userVerificationRepo.update(verification);
  }
}
