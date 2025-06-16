import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';

export type JwtPayloadType = Pick<UserOrmEntity, 'id' | 'role'> & {
  iat: number;
  exp: number;
};
