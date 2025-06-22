import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class UserVerificationCreatedDomainEvent extends DomainEvent {
  readonly token: string;

  readonly email: string;

  constructor(props: DomainEventProps<UserVerificationCreatedDomainEvent>) {
    super(props);
    this.token = props.token;
    this.email = props.email;
  }
}
