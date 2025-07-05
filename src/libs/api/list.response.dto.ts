import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListResponseDto<T> {
  @ApiProperty({ isArray: true })
  @Type(() => Object)
  readonly data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
