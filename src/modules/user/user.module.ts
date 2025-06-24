import { Logger, Module, Provider } from '@nestjs/common';
import { UserRepository } from './database/adapters/user.repository';

import { CreateUserService } from './commands/create-user/create-user.service';

import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { GetUserByIdController } from './queries/get-my-user/get-user-by-id.controller';
import { GetUserByIdQueryHandler } from './queries/get-my-user/get-user-by-id.query-handler';

const controllers = [GetUserByIdController];

const commandHandlers: Provider[] = [CreateUserService];

const queryHandlers: Provider[] = [GetUserByIdQueryHandler];

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
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
  exports: [USER_REPOSITORY, UserMapper],
})
export class UserModule {}
