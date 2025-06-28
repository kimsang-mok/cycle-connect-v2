import { Logger, Module, Provider } from '@nestjs/common';
import { InitiatePaymentController } from './commands/initiate-payment/initiate-payment.controller';
import { InitiatePaymentService } from './commands/initiate-payment/initiate-payment.service';
import { CqrsModule } from '@nestjs/cqrs';
import { PAYMENT_REPOSITORY } from './payment.di-tokens';
import { PaymentRepository } from './database/adapters/payment.repository';
import { PaymentGatewayModule } from '@src/libs/payment-gateway/payment-gateway.module';
import { PaymentMapper } from './payment.mapper';
import { BookingModule } from '../booking/booking.module';
import { AuthorizePaymentService } from './commands/authorize-payment/authorize-payment.service';
import { AuthorizePaymentController } from './commands/authorize-payment/authorize-payment.controller';
import { CaptureFundService } from './commands/capture-fund/capture-fund.service';
import { CaptureFundController } from './commands/capture-fund/capture-fund.controller';

const controllers = [
  InitiatePaymentController,
  AuthorizePaymentController,
  CaptureFundController,
];

const commandHandlers: Provider[] = [
  InitiatePaymentService,
  AuthorizePaymentService,
  CaptureFundService,
];

const repositories: Provider[] = [
  {
    provide: PAYMENT_REPOSITORY,
    useClass: PaymentRepository,
  },
];

const mappers: Provider[] = [PaymentMapper];

@Module({
  imports: [CqrsModule, PaymentGatewayModule.register(), BookingModule],
  controllers: [...controllers],
  providers: [Logger, ...commandHandlers, ...repositories, ...mappers],
})
export class PaymentModule {}
