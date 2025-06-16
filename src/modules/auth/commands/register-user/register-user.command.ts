import { Command, CommandProps } from '@src/libs/ddd';
import { UserRoles } from '@src/modules/user/domain/user.types';

export class RegisterUserCommand extends Command {
  readonly email: string;

  readonly password: string;

  readonly role: UserRoles;

  constructor(props: CommandProps<RegisterUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
  }
}
