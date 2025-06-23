import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { PaypalPaymentService } from './paypal-payment.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        baseURL: configService.get('payment.host', { infer: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  providers: [PaypalPaymentService],
  exports: [PaypalPaymentService],
})
export class PaypalPaymentModule {}
