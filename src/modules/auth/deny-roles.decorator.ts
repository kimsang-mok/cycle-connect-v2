import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../user/domain/user.types';

export const DenyRoles = (...roles: UserRoles[]) =>
  SetMetadata('denyRoles', roles);
