import { Command, CommandProps } from '@src/libs/ddd';
import { UserRoles } from '../../domain/user.types';

export class CreateUserCommand extends Command {
  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly password: string;

  readonly role: UserRoles;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.password = props.password;
    this.role = props.role;
  }
}
