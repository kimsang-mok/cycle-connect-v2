import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'john-doe@gmail.com',
    description: "User's email address",
  })
  email: string | null;
}
