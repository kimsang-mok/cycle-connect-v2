import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthorizePaymentRequestDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}
