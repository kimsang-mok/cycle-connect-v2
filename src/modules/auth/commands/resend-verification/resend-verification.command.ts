import { Command, CommandProps } from '@src/libs/ddd';

export class ResendVerificationCommand extends Command {
  readonly email: string;

  constructor(props: CommandProps<ResendVerificationCommand>) {
    super(props);
    this.email = props.email;
  }
}
