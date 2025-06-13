import { PaginatedResponseDto } from '@src/libs/api';
import { UserResponseDto } from './user.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserPaginatedResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  readonly data: readonly UserResponseDto[];
}
