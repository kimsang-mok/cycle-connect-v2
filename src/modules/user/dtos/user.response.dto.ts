import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';
import { UserRoles } from '../domain/user.types';
import { Expose } from 'class-transformer';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'john-doe@gmail.com',
    description: "User's email address",
  })
  @Expose()
  email: string | null;

  @ApiProperty({
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    example: UserRoles.admin,
  })
  @Expose()
  role: UserRoles;
}
