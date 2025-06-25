import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { UserVerificationEntity } from './domain/user-verification.entity';
import { UserVerificationOrmEntity } from './database/user-verification.orm-entity';

@Injectable()
export class UserVerificationMapper
  implements Mapper<UserVerificationEntity, UserVerificationOrmEntity, never>
{
  toPersistence(entity: UserVerificationEntity): UserVerificationOrmEntity {
    const copy = entity.getProps();
    const orm = new UserVerificationOrmEntity();
    orm.id = copy.id;
    orm.userId = copy.userId;
    orm.status = copy.status;
    orm.token = copy.token;
    orm.verifiedAt = copy.verifiedAt;
    orm.createdAt = copy.createdAt;
    return orm;
  }

  toDomain(record: UserVerificationOrmEntity): UserVerificationEntity {
    const entity = new UserVerificationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      props: {
        userId: record.userId,
        status: record.status,
        token: record.token,
        verifiedAt: record.verifiedAt,
      },
    });
    return entity;
  }

  toResponse(): never {
    throw new Error('Not implemented');
  }
}
