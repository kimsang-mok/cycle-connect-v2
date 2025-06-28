import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CaptureFundRequestDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}
