import { DatabaseConfig } from 'database/configs/database-config.type';
import { AppConfig } from './app.config.type';
import { AuthConfig } from '@src/modules/auth/config/auth-config.type';
import { MailerConfig } from '@src/libs/mailer/config/mailer-config.type';
import { PaymentGatewayConfig } from '@src/libs/payment-gateway/config/payment-gateway-config.type';
import { FileConfig } from '@src/libs/uploader/config/file-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mailer: MailerConfig;
  payment: PaymentGatewayConfig;
  file: FileConfig;
};
