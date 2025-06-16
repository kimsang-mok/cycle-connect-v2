import { Command, CommandProps } from '@src/libs/ddd';

export class RefreshTokenCommand extends Command {
  readonly refreshToken: string;

  readonly userId: string;

  constructor(props: CommandProps<RefreshTokenCommand>) {
    super(props);
    this.refreshToken = props.refreshToken;
    this.userId = props.userId;
  }
}
