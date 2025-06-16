import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { AuthenticateUserReturnType } from '../../domain/auth.types';
import { AuthenticateUserService } from '../../services/authenticate-user.service';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@src/modules/user/user.di-tokens';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { InvalidCredentialError } from '../../auth.errors';
import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';

@CommandHandler(LoginUserCommand)
export class LoginUserService
  implements ICommandHandler<LoginUserCommand, AuthenticateUserReturnType>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<AuthenticateUserReturnType> {
    const user = await this.userRepo.findOneByEmail(command.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const match = await user.getProps().password.compare(command.password);

    if (!match) {
      throw new InvalidCredentialError();
    }

    const result = await this.authenticateUserService.execute({
      cookies: command.cookies,
      user,
    });

    return { user, ...result };
  }
}
