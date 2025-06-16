import { Module } from '@nestjs/common';
import { MailerModule } from '@src/libs/mailer/mailer.module';
import { SendVerificationTokenWhenUserVerificationIsCreatedDomainEventHandler } from './event-handlers/send-verification-token-when-user-verification-is-created.domain-event-handler';

const eventHandlers = [
  SendVerificationTokenWhenUserVerificationIsCreatedDomainEventHandler,
];

@Module({
  imports: [MailerModule.register()],
  controllers: [],
  providers: [...eventHandlers],
})
export class NotificationModule {}
