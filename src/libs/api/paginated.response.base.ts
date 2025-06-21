import { ApiProperty } from '@nestjs/swagger';
import { Paginated } from '../ddd';

export abstract class PaginatedResponseDto<T> extends Paginated<T> {
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
  abstract readonly data: readonly T[];
}
