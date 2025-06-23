import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { BookingStatus } from '../booking.types';

export class BookingCreatedDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerName: string;

  readonly start: Date;

  readonly end: Date;

  readonly status: BookingStatus;

  readonly totalPrice: number;

  constructor(props: DomainEventProps<BookingCreatedDomainEvent>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerName = props.customerName;
    this.start = props.start;
    this.end = props.end;
    this.status = props.status;
    this.totalPrice = props.totalPrice;
  }
}
