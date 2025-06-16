import { Injectable } from '@nestjs/common';
import {
  MailerServicePort,
  SendMailProps,
} from '../../ports/mailer.service.port';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { TemplateResolver } from './utils/template-resolver';
import { HttpService } from '@nestjs/axios';
import { EmailBuilder } from './utils/email-builder';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SendgridService implements MailerServicePort {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly templateResolver: TemplateResolver,
    private readonly client: HttpService,
  ) {}

  async sendMail({
    toEmail,
    mailType,
    toName,
    options,
  }: SendMailProps): Promise<void> {
    if (!toEmail) {
      console.warn('Email is required: ', toEmail);
    }

    const builder = new EmailBuilder()
      .setFrom(
        this.configService.getOrThrow('mailer.defaultEmail', { infer: true }),
        this.configService.getOrThrow('mailer.defaultName', { infer: true }),
      )
      .addPersonalization(toName ?? '', toEmail, options);

    const templateId = this.templateResolver.getTemplateId(mailType);
    builder.setTemplateId(templateId);

    const payload = builder.build();

    try {
      await lastValueFrom(this.client.post('/mail/send', payload));
      if (
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production'
      ) {
        console.log(`Email sent ${toEmail}`);
      }
    } catch (error) {
      console.warn(`Failed to send email to ${toEmail} `, error);
    }
  }
}
