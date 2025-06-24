import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class BookingConfirmedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<BookingConfirmedDomainEvent>) {
    super(props);
  }
}
