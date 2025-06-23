import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitiatePaymentCommand } from './initiate-payment.command';
import { PaymentEntity } from '../../domain/payment.entity';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { Inject } from '@nestjs/common';
import { PAYMENT_GATEWAY } from '@src/libs/payment-gateway/payment-gateway.di-tokens';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { Transactional } from '@src/libs/application/decorators';

@CommandHandler(InitiatePaymentCommand)
export class InitiatePaymentService
  implements ICommandHandler<InitiatePaymentCommand, any>
{
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGatewayServicePort,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  @Transactional()
  async execute(command: InitiatePaymentCommand): Promise<any> {
    const payment = PaymentEntity.create({
      ...command,
      amount: new Price(command.amount),
    });

    const result = await this.gateway.authorize({
      orderId: command.orderId,
      amount: command.amount,
      method: command.method,
    });

    if (result.success && result.authorizationId) {
      payment.markAuthorized(result.authorizationId);
    } else {
      payment.markFailed(result.reason ?? 'Unexpected error');
    }

    await this.paymentRepo.insert(payment);
    return payment.id;
  }
}
