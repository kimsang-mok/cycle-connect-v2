import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryPort } from '../../database/ports/user.repository.port';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserNotFoundError } from '../../user.errors';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, UserEntity>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    const user = await this.userRepo.findOneById(query.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
