import { Command, CommandProps } from '@src/libs/ddd';

export class AuthorizePaymentCommand extends Command {
  readonly orderId: string;

  constructor(props: CommandProps<AuthorizePaymentCommand>) {
    super(props);
    this.orderId = props.orderId;
  }
}
