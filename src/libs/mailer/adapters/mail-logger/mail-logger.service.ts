import { Injectable, Logger } from '@nestjs/common';
import {
  MailerServicePort,
  SendMailProps,
} from '../../ports/mailer.service.port';

@Injectable()
export class MailLoggerService implements MailerServicePort {
  private readonly logger = new Logger(MailLoggerService.name);

  async sendMail({
    toEmail,
    mailType,
    toName,
    options,
  }: SendMailProps): Promise<void> {
    this.logger.log(`Simulated email sent: 
        To: ${toName ? `${toName} <${toEmail}>` : toEmail}
        Type: ${mailType}
        Options: ${JSON.stringify(options ?? {}, null, 2)}
    `);
  }
}
