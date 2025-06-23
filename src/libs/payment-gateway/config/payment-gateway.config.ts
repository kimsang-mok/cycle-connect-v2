import { registerAs } from '@nestjs/config';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import validateConfig from '@src/libs/utils/validate-config';
import { PaymentGatewayConfig } from './payment-gateway-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  @IsIn(['mock', 'paypal', 'strip'])
  PAYMENT_GATEWAY: PaymentGatewayConfig['gateway'];

  @IsString()
  @IsOptional()
  PAYMENT_HOST: string;

  @IsString()
  @IsOptional()
  PAYMENT_CURRENCY: string;

  @IsString()
  @IsOptional()
  PAYMENT_ENVIRONMENT: string;

  @IsString()
  @IsOptional()
  PAYMENT_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  PAYMENT_CLIENT_SECRET: string;
}

export default registerAs<PaymentGatewayConfig>('payment', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    gateway:
      (process.env.PAYMENT_GATEWAY as PaymentGatewayConfig['gateway']) ??
      'mock',
    host: process.env.PAYMENT_HOST,
    currency: process.env.PAYMENT_CURRENCY ?? 'usd',
    environment: process.env.PAYMENT_ENVIRONMENT,
    clientId: process.env.PAYMENT_CLIENT_ID,
    clientSecret: process.env.PAYMENT_CLIENT_SECRET,
  };
});
