import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@src/modules/user/dtos/user.response.dto';

export class LoginUserResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  accessToken: string;
}
