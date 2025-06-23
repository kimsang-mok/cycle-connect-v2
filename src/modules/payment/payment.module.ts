import { Module, Provider } from '@nestjs/common';
import { InitiatePaymentController } from './commands/initiate-payment/initiate-payment.controller';
import { InitiatePaymentService } from './commands/initiate-payment/initiate-payment.service';
import { CqrsModule } from '@nestjs/cqrs';
import { PAYMENT_REPOSITORY } from './payment.di-tokens';
import { PaymentRepository } from './database/adapters/payment.repository';
import { PaymentGatewayModule } from '@src/libs/payment-gateway/payment-gateway.module';
import { PaymentMapper } from './payment.mapper';

const controllers = [InitiatePaymentController];

const commandHandlers: Provider[] = [InitiatePaymentService];

const repositories: Provider[] = [
  {
    provide: PAYMENT_REPOSITORY,
    useClass: PaymentRepository,
  },
];

const mappers: Provider[] = [PaymentMapper];

@Module({
  imports: [CqrsModule, PaymentGatewayModule.register()],
  controllers: [...controllers],
  providers: [...commandHandlers, ...repositories, ...mappers],
})
export class PaymentModule {}
