import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class PaymentInitiatedDomainEvent extends DomainEvent {
  readonly bookingId: string;

  readonly orderId: string;

  constructor(props: DomainEventProps<PaymentInitiatedDomainEvent>) {
    super(props);
    this.bookingId = props.bookingId;
    this.orderId = props.orderId;
  }
}
