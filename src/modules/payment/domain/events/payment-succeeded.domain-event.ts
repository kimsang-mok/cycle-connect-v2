import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class PaymentSucceededDomainEvent extends DomainEvent {
  readonly bookingId: string;

  constructor(props: DomainEventProps<PaymentSucceededDomainEvent>) {
    super(props);
    this.bookingId = props.bookingId;
  }
}
