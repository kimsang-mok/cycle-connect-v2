import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MailerConfig } from './mailer-config.type';
import validateConfig from '@src/libs/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  @IsIn(['sendgrid', 'logger'])
  TRANSPORTER_TYPE: MailerConfig['transporterType'];

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsString()
  MAIL_HOST: string;

  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @IsString()
  VERIFY_TEMPLATE_PATH: string;

  @IsString()
  FORGOT_PASSWORD_TEMPLATE_PATH: string;

  @IsString()
  TWO_FACTOR_TEMPLATE_PATH: string;
}

export default registerAs<MailerConfig>('mailer', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    transporterType:
      (process.env.TRANSPORTER_TYPE as MailerConfig['transporterType']) ??
      'logger',
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    verifyTemplatePath: process.env.VERIFY_TEMPLATE_PATH,
    forgotPasswordTemplatePath: process.env.FORGOT_PASSWORD_TEMPLATE_PATH,
    twoFactorTemplatePath: process.env.TWO_FACTOR_TEMPLATE_PATH,
  };
});
