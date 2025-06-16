import { SqlRepositoryBase } from '@src/libs/db';
import { SessionEntity } from '../../domain/session.entity';
import { SessionOrmEntity } from '../session.orm-entity';
import { SessionRepositoryPort } from '../ports/session.repository.port';
import { SessionMapper } from '../../session.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@src/libs/exceptions';

@Injectable()
export class SessionRepository
  extends SqlRepositoryBase<SessionEntity, SessionOrmEntity>
  implements SessionRepositoryPort
{
  protected readonly entityClass = SessionOrmEntity;

  constructor(mapper: SessionMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(SessionRepository.name));
  }

  async findOneByRefreshToken(refreshToken: string): Promise<SessionEntity> {
    const entity = await this.repository.findOne({
      where: { refreshToken },
    });

    if (!entity) {
      throw new NotFoundException(
        `Session with refreshToken ${refreshToken} not found`,
      );
    }

    return this.mapper.toDomain(entity);
  }

  async deleteByRefreshToken(refreshToken: string): Promise<boolean> {
    const result = await this.repository.delete({
      refreshToken,
    });
    return result.affected && result.affected > 0 ? true : false;
  }
}
