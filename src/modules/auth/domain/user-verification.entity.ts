import { AggregateRoot } from '@src/libs/ddd';
import { AggregateId } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { UserVerificationCreatedDomainEvent } from './events/user-verification-created.domain-event';
import {
  CreateUserVerificationProps,
  UserVerificationProps,
  VerificationStatus,
} from './auth.types';
import { UserVerifiedDomainEvent } from './events/user-verified.domain-event';
import { UserAlreadyVerifiedError } from '../auth.errors';

export class UserVerificationEntity extends AggregateRoot<UserVerificationProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateUserVerificationProps): UserVerificationEntity {
    const id = randomUUID();
    const props: UserVerificationProps = {
      userId: create.userId,
      token: create.token,
      status: VerificationStatus.pending,
    };

    const verification = new UserVerificationEntity({
      id,
      props,
    });

    verification.addEvent(
      new UserVerificationCreatedDomainEvent({
        aggregateId: id,
        email: create.email.unpack(),
        token: create.token,
      }),
    );

    return verification;
  }

  updateToken(newToken: string, email: string) {
    this.props.token = newToken;

    this.addEvent(
      new UserVerificationCreatedDomainEvent({
        aggregateId: this.id,
        token: newToken,
        email,
      }),
    );
  }

  verify(): void {
    if (this.props.status === VerificationStatus.verified)
      throw new UserAlreadyVerifiedError();

    this.addEvent(
      new UserVerifiedDomainEvent({
        aggregateId: this.id,
        userId: this.props.userId,
      }),
    );

    this.props.status = VerificationStatus.verified;
    this.props.verifiedAt = new Date();
  }

  public validate(): void {}
}
