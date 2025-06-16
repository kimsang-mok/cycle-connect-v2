import { Command, CommandProps } from '@src/libs/ddd';

export class VerifyAccountCommand extends Command {
  readonly token: string;

  constructor(props: CommandProps<VerifyAccountCommand>) {
    super(props);
    this.token = props.token;
  }
}
