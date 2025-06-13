import { Logger, Module, Provider } from '@nestjs/common';
import { UserRepository } from './database/adapters/user.repository';

import { CreateUserService } from './commands/create-user/create-user.service';

import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { CreateUserController } from './commands/create-user/create-user.controller';

const controllers = [CreateUserController];

const commandHandlers: Provider[] = [CreateUserService];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...mappers],
  exports: [USER_REPOSITORY, UserMapper],
})
export class UserModule {}
