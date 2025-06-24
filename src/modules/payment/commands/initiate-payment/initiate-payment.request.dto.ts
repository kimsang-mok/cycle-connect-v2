import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../../domain/payment.types';

export class InitiatePaymentRequestDto {
  @ApiProperty({
    description: 'paymentMethodId for Stripe or orderId for Paypal',
  })
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  bookingId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
