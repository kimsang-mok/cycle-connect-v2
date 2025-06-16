import { Mapper } from '@src/libs/ddd';
import { SessionEntity } from './domain/session.entity';
import { SessionOrmEntity } from './database/session.orm-entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionMapper
  implements Mapper<SessionEntity, SessionOrmEntity, never>
{
  toPersistence(entity: SessionEntity): SessionOrmEntity {
    const copy = entity.getProps();
    const orm = new SessionOrmEntity();
    return {
      ...orm,
      id: copy.id,
      userId: copy.userId,
      accessToken: copy.accessToken,
      refreshToken: copy.refreshToken,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
    };
  }

  toDomain(record: SessionOrmEntity): SessionEntity {
    const entity = new SessionEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        userId: record.userId,
        accessToken: record.accessToken,
        refreshToken: record.refreshToken,
      },
    });
    return entity;
  }

  toResponse(): never {
    throw new Error('Not implemented');
  }
}
