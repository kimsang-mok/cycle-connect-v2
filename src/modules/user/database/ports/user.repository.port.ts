import { PaginatedQueryParams, RepositoryPort } from '@src/libs/ddd';
import { UserEntity } from '../../domain/user.entity';

export interface FindUsersParams extends PaginatedQueryParams {
  readonly email?: string;
}

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<UserEntity | null>;
}
