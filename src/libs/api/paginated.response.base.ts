import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginatedResponseDto<T> {
  constructor(props: PaginatedResponseDto<T>) {
    this.total = props.total;
    this.page = props.page;
    this.totalPages = props.totalPages;
    this.limit = props.limit;
    this.data = props.data;
  }

  @ApiProperty({
    example: 5312,
    description: 'Total number of items',
  })
  readonly total: number;

  @ApiProperty({
    example: 10,
    description: 'Total number of items',
  })
  readonly totalPages: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  readonly limit: number;

  @ApiProperty({ example: 0, description: 'Page number' })
  readonly page: number;

  @ApiProperty({ isArray: true })
  @Type(() => Object)
  readonly data: readonly T[];
}
