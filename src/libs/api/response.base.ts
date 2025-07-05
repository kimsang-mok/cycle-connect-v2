import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export interface BaseResponseProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase {
  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  @Expose()
  readonly id: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @Expose()
  @Transform(
    ({ value }) => (value instanceof Date ? value.toISOString() : value),
    { toPlainOnly: true },
  )
  createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @Expose()
  @Transform(
    ({ value }) => (value instanceof Date ? value.toISOString() : value),
    { toPlainOnly: true },
  )
  updatedAt: string;
}
