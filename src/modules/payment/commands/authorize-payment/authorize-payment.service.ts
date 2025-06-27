import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthorizePaymentCommand } from './authorize-payment.command';
import { Inject } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { PAYMENT_GATEWAY } from '@src/libs/payment-gateway/payment-gateway.di-tokens';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import {
  PaymentAuthorizationFailedError,
  PaymentNotFoundError,
} from '../../payment.errors';
import { Transactional } from '@src/libs/application/decorators';

@CommandHandler(AuthorizePaymentCommand)
export class AuthorizePaymentService
  implements ICommandHandler<AuthorizePaymentCommand, string>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGatewayServicePort,
  ) {}

  @Transactional()
  async execute(command: AuthorizePaymentCommand): Promise<string> {
    const payment = await this.paymentRepo.findOneByOrderId(command.orderId);

    if (!payment) {
      throw new PaymentNotFoundError();
    }

    const result = await this.gateway.getAuthorizationId(command.orderId);

    if (!result.success) {
      throw new PaymentAuthorizationFailedError();
    }

    payment.markAuthorized(result.authorizationId!);

    await this.paymentRepo.update(payment);
    return payment.id;
  }
}
