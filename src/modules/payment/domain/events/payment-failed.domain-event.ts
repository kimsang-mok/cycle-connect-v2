import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class PaymentFailedDomainEvent extends DomainEvent {
  readonly bookingId: string;

  readonly orderId: string;

  constructor(props: DomainEventProps<PaymentFailedDomainEvent>) {
    super(props);
    this.bookingId = props.bookingId;
    this.orderId = props.orderId;
  }
}
