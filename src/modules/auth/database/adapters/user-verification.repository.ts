/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { UserVerificationEntity } from '../../domain/user-verification.entity';
import { UserVerificationRepositoryPort } from '../ports/user-verification.repository.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserVerificationMapper } from '../../user-verification.mapper';
import { UserVerificationOrmEntity } from '../user-verification.orm-entity';
import { NotFoundException } from '@src/libs/exceptions';

@Injectable()
export class UserVerificationRepository
  extends SqlRepositoryBase<UserVerificationEntity, UserVerificationOrmEntity>
  implements UserVerificationRepositoryPort
{
  protected readonly entityClass = UserVerificationOrmEntity;

  constructor(mapper: UserVerificationMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(UserVerificationRepository.name));
  }

  async findOneByUserId(userId: string): Promise<UserVerificationEntity> {
    const record = await this.repository.findOne({
      where: { userId },
    });

    if (!record) {
      throw new NotFoundException('Verification not found');
    }

    return this.mapper.toDomain(record);
  }
}
