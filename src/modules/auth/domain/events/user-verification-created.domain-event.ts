import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { VerificationStatus } from '../auth.types';

export class UserVerificationCreatedDomainEvent extends DomainEvent {
  readonly userId: string;

  readonly status: VerificationStatus;

  readonly token: string;

  constructor(props: DomainEventProps<UserVerificationCreatedDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.status = props.status;
    this.token = props.token;
  }
}
