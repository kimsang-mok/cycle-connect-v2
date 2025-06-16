import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  COOKIE_SERVICE,
  SESSION_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from './auth.di-tokens';
import { UserVerificationRepository } from './database/adapters/user-verification.repository';
import { CreateUserVerificationWhenUserIsCreatedDomainEventHandler } from './event-handlers/create-user-verification-when-user-is-created.domain-event-handler';
import { UserVerificationMapper } from './user-verification.mapper';
import { SessionRepository } from './database/adapters/session.repository';
import { SessionMapper } from './session.mapper';
import { SessionService } from './services/session.service';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { VerifyAccountService } from './commands/verify-account/verify-account.service';
import { VerifyAccountController } from './commands/verify-account/verify-account.controller';
import { CookieService } from './libs/cookies/cookies.service';
import { RegisterUserController } from './commands/register-user/register-user.controller';
import { JwtStrategy } from './libs/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './libs/strategies/jwt-refresh.strategy';

const controllers = [RegisterUserController, VerifyAccountController];

const services: Provider[] = [
  SessionService,
  AuthenticateUserService,
  {
    provide: COOKIE_SERVICE,
    useClass: CookieService,
  },
];

const commandHandlers: Provider[] = [VerifyAccountService];

const eventHandlers: Provider[] = [
  CreateUserVerificationWhenUserIsCreatedDomainEventHandler,
];

const strategies: Provider[] = [JwtStrategy, JwtRefreshStrategy];

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
