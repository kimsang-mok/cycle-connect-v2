import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookingRequestDto {
  @ApiProperty({
    description: 'UUID of the bike to be booked',
    example: 'c1b1d4f3-4d8e-47f1-8a97-b87a72636477',
  })
  @IsUUID()
  @IsNotEmpty()
  bikeId: string;

  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    description: 'Start date of the booking period',
    example: '2025-06-01',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the booking period',
    example: '2025-06-01',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
