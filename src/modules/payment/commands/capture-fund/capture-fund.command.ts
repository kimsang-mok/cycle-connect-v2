import { Command, CommandProps } from '@src/libs/ddd';
import { BookingStatus } from '@src/modules/booking/domain/booking.types';

export class CaptureFundCommand extends Command {
  readonly orderId: string;

  readonly bookingStatus?: BookingStatus;

  constructor(props: CommandProps<CaptureFundCommand>) {
    super(props);
    this.orderId = props.orderId;
    this.bookingStatus = props.bookingStatus;
  }
}
