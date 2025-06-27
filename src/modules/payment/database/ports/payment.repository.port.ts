import { RepositoryPort } from '@src/libs/ddd';
import { PaymentEntity } from '../../domain/payment.entity';

export interface PaymentRepositoryPort extends RepositoryPort<PaymentEntity> {
  findOneByBookingId(bookingId: string): Promise<PaymentEntity | null>;

  findOneByAuthorizationId(
    authorizationId: string,
  ): Promise<PaymentEntity | null>;

  findOneByOrderId(orderId: string): Promise<PaymentEntity | null>;
}
