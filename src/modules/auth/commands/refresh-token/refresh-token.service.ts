import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { AuthenticateUserReturnType } from '../../domain/auth.types';
import { SessionService } from '../../services/session.service';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@src/modules/user/user.di-tokens';
import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { AuthenticateUserService } from '../../services/authenticate-user.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenService
  implements ICommandHandler<RefreshTokenCommand, AuthenticateUserReturnType>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly sessionService: SessionService,
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<AuthenticateUserReturnType> {
    const { refreshToken, userId } = command;

    const sesssion = await this.sessionService.verifySession(
      refreshToken,
      userId,
    );

    const user = await this.authenticateUserService.getUserById(userId);

    const result = await this.authenticateUserService.getTokensData({
      id: userId,
      role: user.role,
    });

    await this.sessionService.update(sesssion, result);

    return {
      user,
      ...result,
    };
  }
}
