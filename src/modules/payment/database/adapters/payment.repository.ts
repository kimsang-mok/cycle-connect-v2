import { SqlRepositoryBase } from '@src/libs/db';
import { PaymentEntity } from '../../domain/payment.entity';
import { PaymentOrmEntity } from '../payment.orm-entity';
import { PaymentRepositoryPort } from '../ports/payment.repository.port';
import { PaymentMapper } from '../../payment.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentRepository
  extends SqlRepositoryBase<PaymentEntity, PaymentOrmEntity>
  implements PaymentRepositoryPort
{
  protected readonly entityClass = PaymentOrmEntity;
  constructor(mapper: PaymentMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(PaymentRepository.name));
  }

  async findOneByAuthorizationId(
    authorizationId: string,
  ): Promise<PaymentEntity | null> {
    const payment = await this.repository.findOne({
      where: { authorizationId },
    });

    return payment ? this.mapper.toDomain(payment) : null;
  }
}
