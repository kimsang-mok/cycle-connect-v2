import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentResponseDto {
  @ApiProperty()
  paypalOrderId: string;
}
