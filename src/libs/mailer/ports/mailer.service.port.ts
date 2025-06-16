import { MailType } from '../mailer.enums';

export type SendMailProps = {
  toEmail: string;
  mailType: MailType;
  toName?: string;
  options?: Record<string, any>;
};

export interface MailerServicePort {
  sendMail(props: SendMailProps): Promise<void>;
}
