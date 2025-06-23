import { Command, CommandProps } from '@src/libs/ddd';
import { PaymentMethod } from '../../domain/payment.types';

export class InitiatePaymentCommand extends Command {
  readonly orderId: string;

  readonly bookingId: string;

  readonly amount: number;

  readonly method: PaymentMethod;

  constructor(props: CommandProps<InitiatePaymentCommand>) {
    super(props);
    this.orderId = props.orderId;
    this.bookingId = props.bookingId;
    this.amount = props.amount;
    this.method = props.method;
  }
}
