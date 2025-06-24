import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class PaymentAuthorizedDomainEvent extends DomainEvent {
  readonly bookingId: string;

  readonly orderId: string;

  readonly authorizationId: string;

  constructor(props: DomainEventProps<PaymentAuthorizedDomainEvent>) {
    super(props);
    this.bookingId = props.bookingId;
    this.orderId = props.orderId;
    this.authorizationId = props.authorizationId;
  }
}
