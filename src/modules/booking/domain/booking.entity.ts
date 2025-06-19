import { AggregateRoot } from '@src/libs/ddd';
import {
  BookingProps,
  BookingStatus,
  CreateBookingProps,
} from './booking.types';
import { AggregateId } from '@src/libs/ddd';
import { randomUUID } from 'crypto';

export class BookingEntity extends AggregateRoot<BookingProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateBookingProps) {
    const id = randomUUID();

    const props: BookingProps = {
      ...create,
      status: BookingStatus.confirmed,
    };

    const booking = new BookingEntity({ id, props });

    return booking;
  }

  public validate(): void {}
}
