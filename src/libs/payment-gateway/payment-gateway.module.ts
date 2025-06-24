import { DynamicModule, Module } from '@nestjs/common';
import { MockPaymentModule } from './adapters/mock/mock-payment.module';
import { PAYMENT_GATEWAY } from './payment-gateway.di-tokens';
import { ConfigService } from '@nestjs/config';
import { MockPaymentService } from './adapters/mock/mock-payment.service';
import { AllConfigType } from '@src/configs/config.type';
import { PaypalPaymentService } from './adapters/paypal/paypal-payment.service';
import { PaypalPaymentModule } from './adapters/paypal/paypal-payment.module';

@Module({})
export class PaymentGatewayModule {
  static register(): DynamicModule {
    return {
      module: PaymentGatewayModule,
      imports: [MockPaymentModule, PaypalPaymentModule],
      providers: [
        {
          provide: PAYMENT_GATEWAY,
          inject: [ConfigService, MockPaymentService],
          useFactory: (
            configService: ConfigService<AllConfigType>,
            mock: MockPaymentService,
            paypal: PaypalPaymentService,
          ) => {
            const provider = configService.get('payment.gateway', {
              infer: true,
            });
            switch (provider) {
              case 'paypal':
                return paypal;
              case 'mock':
              default:
                return mock;
            }
          },
        },
      ],
      exports: [PAYMENT_GATEWAY],
    };
  }
}
