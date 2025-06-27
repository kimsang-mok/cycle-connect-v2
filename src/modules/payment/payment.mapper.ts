import { Mapper } from '@src/libs/ddd';
import { PaymentEntity } from './domain/payment.entity';
import { PaymentOrmEntity } from './database/payment.orm-entity';
import { Price } from '../bike/domain/value-objects/price.value-object';
import { PaymentStatus } from './domain/value-objects/payment-status.value-object';
import { PaymentStatusType } from './domain/payment.types';

export class PaymentMapper
  implements Mapper<PaymentEntity, PaymentOrmEntity, any>
{
  toPersistence(entity: PaymentEntity): PaymentOrmEntity {
    const copy = entity.getProps();
    const orm = new PaymentOrmEntity();
    orm.id = copy.id;
    orm.bookingId = copy.bookingId;
    orm.orderId = copy.orderId;
    orm.authorizationId = copy.authorizationId;
    orm.amount = copy.amount.unpack();
    orm.method = copy.method;
    orm.status = copy.status.value;
    orm.failureReason = copy.status.getFailureReason();
    orm.createdAt = copy.createdAt;
    orm.updatedAt = copy.updatedAt;
    return orm;
  }

  toDomain(record: PaymentOrmEntity): PaymentEntity {
    const entity = new PaymentEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.createdAt),
      props: {
        bookingId: record.bookingId,
        orderId: record.orderId,
        authorizationId: record.authorizationId,
        amount: new Price(record.amount),
        method: record.method,
        status:
          record.status !== PaymentStatusType.failed
            ? new PaymentStatus({ value: record.status })
            : new PaymentStatus({
                value: record.status,
                reason: record.failureReason,
              }),
      },
    });
    return entity;
  }

  toResponse() {}
}
