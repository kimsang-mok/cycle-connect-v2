import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';
import { UserRoles } from '../domain/user.types';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'john-doe@gmail.com',
    description: "User's email address",
  })
  email: string | null;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    example: UserRoles.admin,
  })
  role: UserRoles;
}
