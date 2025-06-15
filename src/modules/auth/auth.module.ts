import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  SESSION_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from './auth.di-tokens';
import { UserVerificationRepository } from './database/adapters/user-verification.repository';
import { CreateUserVerificationWhenUserIsCreatedDomainEventHandler } from './event-handlers/create-user-verification-when-user-is-created.domain-event-handler';
import { UserVerificationMapper } from './user-verification.mapper';
import { SessionRepository } from './database/adapters/session.repository';
import { SessionMapper } from './session.mapper';

const controllers = [];

const services: Provider[] = [];

const commandHandlers: Provider[] = [];

const eventHandlers: Provider[] = [
  CreateUserVerificationWhenUserIsCreatedDomainEventHandler,
];

const strategies: Provider[] = [];

const repositories: Provider[] = [
  {
    provide: USER_VERIFICATION_REPOSITORY,
    useClass: UserVerificationRepository,
  },
  {
    provide: SESSION_REPOSITORY,
    useClass: SessionRepository,
  },
];

const mappers: Provider[] = [UserVerificationMapper, SessionMapper];

@Module({
  imports: [CqrsModule, UserModule, PassportModule, JwtModule.register({})],
  controllers: [...controllers],
  providers: [
    Logger,
    ...services,
    ...strategies,
    ...commandHandlers,
    ...eventHandlers,
    ...repositories,
    ...mappers,
  ],
  exports: [],
})
export class AuthModule {}
