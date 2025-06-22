import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { UserRoles } from '../user.types';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly email: string;

  readonly password: string;

  readonly role: UserRoles;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
  }
}
