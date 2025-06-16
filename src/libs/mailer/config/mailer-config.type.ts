export type MailerConfig = {
  transporterType: 'sendgrid' | 'logger';
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
  verifyTemplatePath?: string;
  forgotPasswordTemplatePath?: string;
  twoFactorTemplatePath?: string;
};
