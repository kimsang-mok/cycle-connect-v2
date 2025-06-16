import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MAILER } from '@src/libs/mailer/mailer.di-tokens';
import { MailType } from '@src/libs/mailer/mailer.enums';
import { MailerServicePort } from '@src/libs/mailer/ports/mailer.service.port';
import { UserVerificationCreatedDomainEvent } from '@src/modules/auth/domain/events/user-verification-created.domain-event';

export class SendVerificationTokenWhenUserVerificationIsCreatedDomainEventHandler {
  constructor(
    @Inject(MAILER)
    private readonly mailerService: MailerServicePort,
  ) {}

  @OnEvent(UserVerificationCreatedDomainEvent.name)
  async handle(event: UserVerificationCreatedDomainEvent): Promise<void> {
    const url = new URL('http://localhost:3000/v1/auth/confirm-email');
    url.searchParams.set('token', event.token);

    await this.mailerService.sendMail({
      toEmail: event.email.unpack(),
      toName: 'Mocked User',
      mailType: MailType.VERIFY_EMAIL,
      options: { url },
    });
  }
}
