import { Command, CommandProps } from '@src/libs/ddd';

export class CreateBookingCommand extends Command {
  readonly bikeId: string;

  readonly customerName: string;

  readonly startDate: Date;

  readonly endDate: Date;

  constructor(props: CommandProps<CreateBookingCommand>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerName = props.customerName;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}
