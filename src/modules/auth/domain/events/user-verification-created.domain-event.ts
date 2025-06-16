import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { Email } from '@src/modules/user/domain/value-objects/email.value-object';

export class UserVerificationCreatedDomainEvent extends DomainEvent {
  readonly token: string;

  readonly email: Email;

  constructor(props: DomainEventProps<UserVerificationCreatedDomainEvent>) {
    super(props);
    this.token = props.token;
    this.email = props.email;
  }
}
