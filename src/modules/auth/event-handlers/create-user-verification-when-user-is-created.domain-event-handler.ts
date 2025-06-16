import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '@src/modules/user/domain/events/user-created.domain-event';
import { USER_VERIFICATION_REPOSITORY } from '../auth.di-tokens';
import { UserVerificationEntity } from '../domain/user-verification.entity';
import { JwtService } from '@nestjs/jwt';
import { UserVerificationRepositoryPort } from '../database/ports/user-verification.repository.port';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

export class CreateUserVerificationWhenUserIsCreatedDomainEventHandler {
  private readonly logger = new Logger(
    CreateUserVerificationWhenUserIsCreatedDomainEventHandler.name,
  );

  constructor(
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @OnEvent(UserCreatedDomainEvent.name, { suppressErrors: false })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    const token = await this.jwtService.signAsync(
      { confirmEmailUserId: event.aggregateId },
      {
        secret: this.configService.get('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.get('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    const verification = UserVerificationEntity.create({
      userId: event.aggregateId,
      token,
    });

    this.logger.log('Token: ', token);

    await this.userVerificationRepo.insert(verification);
  }
}
