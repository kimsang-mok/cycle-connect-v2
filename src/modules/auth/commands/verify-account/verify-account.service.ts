import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyAccountCommand } from './verify-account.command';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { USER_VERIFICATION_REPOSITORY } from '../../auth.di-tokens';
import { UserVerificationRepositoryPort } from '../../database/ports/user-verification.repository.port';
import { Transactional } from '@src/libs/application/decorators';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { AuthenticateUserService } from '../../services/authenticate-user.service';
import { AuthenticateUserReturnType } from '../../domain/auth.types';

@CommandHandler(VerifyAccountCommand)
export class VerifyAccountService
  implements ICommandHandler<VerifyAccountCommand, AuthenticateUserReturnType>
{
  constructor(
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  @Transactional()
  async execute(
    command: VerifyAccountCommand,
  ): Promise<AuthenticateUserReturnType> {
    let userId: string;

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: string;
      }>(command.token, {
        secret: this.configService.get('auth.confirmEmailSecret', {
          infer: true,
        }),
      });
      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException('Invalid token');
    }

    const verification =
      await this.userVerificationRepo.findOneByUserId(userId);

    verification.verify();

    await this.userVerificationRepo.update(verification);

    const result = await this.authenticateUserService.execute({
      userId,
      cookies: { jwt: undefined },
    });

    return result;
  }
}
