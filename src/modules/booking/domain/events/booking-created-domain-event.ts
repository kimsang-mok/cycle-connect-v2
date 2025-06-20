import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { BookingStatus } from '../booking.types';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';

export class BookingCreatedDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerName: string;

  readonly start: Date;

  readonly end: Date;

  readonly status: BookingStatus;

  readonly totalPrice: Price;

  constructor(props: DomainEventProps<BookingCreatedDomainEvent>) {
    super(props);
    this.customerName = props.customerName;
  }
}
