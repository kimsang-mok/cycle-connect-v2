import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { UserEntity } from './domain/user.entity';
import { UserResponseDto } from './dtos/user.response.dto';
import { Email } from './domain/value-objects/email.value-object';
import { Password } from './domain/value-objects/password.value-object';
import { UserOrmEntity } from './database/user.orm-entity';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserOrmEntity, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserOrmEntity {
    const copy = entity.getProps();
    const orm = new UserOrmEntity();
    orm.id = copy.id;
    orm.email = copy.email.unpack();
    orm.password = copy.password.unpack();
    orm.role = copy.role;
    orm.createdAt = copy.createdAt;
    orm.updatedAt = copy.updatedAt;
    return orm;
  }

  toDomain(record: UserOrmEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: new Email(record.email),
        password: Password.fromHashed(record.password),
        role: record.role,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.email = props.email?.unpack();
    return response;
  }
}
