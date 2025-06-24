import { RepositoryPort } from '@src/libs/ddd';
import { PaymentEntity } from '../../domain/payment.entity';

export interface PaymentRepositoryPort extends RepositoryPort<PaymentEntity> {
  findOneByAuthorizationId(
    authorizationId: string,
  ): Promise<PaymentEntity | null>;
}
