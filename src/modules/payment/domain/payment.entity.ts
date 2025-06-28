import { AggregateId, AggregateRoot } from '@src/libs/ddd';
import {
  CreatePaymentProps,
  PaymentProps,
  PaymentStatusType,
} from './payment.types';
import { randomUUID } from 'crypto';
import { PaymentStatus } from './value-objects/payment-status.value-object';
import { ArgumentInvalidException } from '@src/libs/exceptions';
import { PaymentSucceededDomainEvent } from './events/payment-succeeded.domain-event';
import { PaymentFailedDomainEvent } from './events/payment-failed.domain-event';
import { PaymentAuthorizedDomainEvent } from './events/payment-authorized.domain-event';
import { InvalidStateTransitionError } from '../payment.errors';

export class PaymentEntity extends AggregateRoot<PaymentProps> {
  protected readonly _id: AggregateId;

  static create(create: CreatePaymentProps): PaymentEntity {
    const id = randomUUID();

    const props: PaymentProps = {
      ...create,
      orderId: '',
      status: PaymentStatus.initiate(),
    };

    const payment = new PaymentEntity({ id, props });

    return payment;
  }

  markSucceeded(): void {
    this.props.status = PaymentStatus.succeeded();

    this.addEvent(
      new PaymentSucceededDomainEvent({
        aggregateId: this.id,
        bookingId: this.props.bookingId,
      }),
    );
  }

  markPending(orderId: string): void {
    if (!this.props.status.is(PaymentStatusType.initiated)) {
      throw new InvalidStateTransitionError();
    }

    this.props.orderId = orderId;
    this.props.status = PaymentStatus.pending();
  }

  markAuthorized(authorizationId: string): void {
    this.props.authorizationId = authorizationId;
    this.props.status = PaymentStatus.authorize();

    this.addEvent(
      new PaymentAuthorizedDomainEvent({
        aggregateId: this.id,
        bookingId: this.props.bookingId,
        orderId: this.props.orderId,
        authorizationId: this.props.authorizationId,
      }),
    );
  }

  markFailed(reason: string): void {
    this.props.status = PaymentStatus.failed(reason);

    this.addEvent(
      new PaymentFailedDomainEvent({
        aggregateId: this.id,
        bookingId: this.props.bookingId,
        orderId: this.props.orderId,
      }),
    );
  }

  get isFinalized(): boolean {
    return this.props.status.isFinal();
  }

  public validate(): void {
    if (!this.props.bookingId) {
      throw new ArgumentInvalidException('Booking Id is required');
    }

    if (Number(this.props.amount.unpack()) < 0) {
      throw new ArgumentInvalidException('Invalid amount');
    }

    if (this.props.authorizationId && !this.props.orderId) {
      throw new ArgumentInvalidException(
        'AuthorizationId cannot exist without OrderId',
      );
    }
  }
}
