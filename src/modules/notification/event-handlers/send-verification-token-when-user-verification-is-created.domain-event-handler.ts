import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { AllConfigType } from '@src/configs/config.type';
import { MAILER } from '@src/libs/mailer/mailer.di-tokens';
import { MailType } from '@src/libs/mailer/mailer.enums';
import { MailerServicePort } from '@src/libs/mailer/ports/mailer.service.port';
import { UserVerificationCreatedDomainEvent } from '@src/modules/auth/domain/events/user-verification-created.domain-event';

export class SendVerificationTokenWhenUserVerificationIsCreatedDomainEventHandler {
  constructor(
    @Inject(MAILER)
    private readonly mailerService: MailerServicePort,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @OnEvent(UserVerificationCreatedDomainEvent.name)
  async handle(event: UserVerificationCreatedDomainEvent): Promise<void> {
    const clientUrl = this.configService.getOrThrow('app.frontendDomain', {
      infer: true,
    });
    const url = new URL(`${clientUrl}/auth/confirm-email`);
    url.searchParams.set('token', event.token);

    await this.mailerService.sendMail({
      toEmail: event.email,
      toName: 'Mocked User',
      mailType: MailType.VERIFY_EMAIL,
      options: { url },
    });
  }
}
