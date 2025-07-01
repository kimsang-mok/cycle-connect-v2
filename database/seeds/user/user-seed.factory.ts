import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { UserRoles } from '@src/modules/user/domain/user.types';
import {
  randomUserRole,
  randomUserEmail,
  randomUserName,
  randomUserPassword,
  randomToken,
} from './user-faker.util';
import { hashSync } from 'bcryptjs';
import { UserVerificationOrmEntity } from '@src/modules/auth/database/user-verification.orm-entity';
import { VerificationStatus } from '@src/modules/auth/domain/auth.types';

interface UserSeedProps {
  role?: UserRoles;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export function createUserSeed(props: UserSeedProps) {
  const user = new UserOrmEntity();

  user.id = crypto.randomUUID();
  user.email = props.email ?? randomUserEmail();

  const name = randomUserName();
  user.firstName = props.firstName ?? name.firstName;
  user.lastName = props.lastName ?? name.lastName;

  user.password = hashSync(props.password ?? randomUserPassword(), 10);
  user.role = props.role ?? randomUserRole();

  const verification = new UserVerificationOrmEntity();
  verification.id = crypto.randomUUID();
  verification.userId = user.id;
  verification.token = randomToken();
  verification.status = VerificationStatus.verified;
  verification.verifiedAt = new Date();

  return { user, verification };
}
