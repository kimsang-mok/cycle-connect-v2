import { AggregateRoot } from '@src/libs/ddd';
import {
  BookingProps,
  BookingStatus,
  CreateBookingProps,
} from './booking.types';
import { AggregateId } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { BookingCreatedDomainEvent } from './events/booking-created.domain-event';
import { BookingConfirmedDomainEvent } from './events/booking-confirmed.domain.event';

export class BookingEntity extends AggregateRoot<BookingProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateBookingProps) {
    const id = randomUUID();

    const props: BookingProps = {
      ...create,
      status: BookingStatus.pending,
    };

    const booking = new BookingEntity({ id, props });

    booking.addEvent(
      new BookingCreatedDomainEvent({
        aggregateId: id,
        bikeId: props.bikeId,
        customerName: props.customerName,
        start: props.period.start,
        end: props.period.end,
        status: props.status,
        totalPrice: props.totalPrice.unpack(),
      }),
    );
    return booking;
  }

  confirm() {
    this.props.status = BookingStatus.confirmed;
    this.addEvent(
      new BookingConfirmedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  public validate(): void {}
}
