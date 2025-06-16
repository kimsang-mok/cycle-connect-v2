/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserMapper } from '../../user.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserOrmEntity } from '../user.orm-entity';

@Injectable()
export class UserRepository
  extends SqlRepositoryBase<UserEntity, UserOrmEntity>
  implements UserRepositoryPort
{
  protected readonly entityClass = UserOrmEntity;

  constructor(mapper: UserMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(UserRepository.name));
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.repository.findOne({
      where: { email },
    });

    return entity ? this.mapper.toDomain(entity) : null;
  }
}
