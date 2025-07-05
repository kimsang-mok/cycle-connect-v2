import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api';
import { BookingStatus } from '../domain/booking.types';
import { Expose } from 'class-transformer';

export class BookingResponseDto extends ResponseBase {
  @ApiProperty({
    description: 'ID of the bike being booked',
    example: 'aa7d3a48-3fc9-4ac6-bd80-4ebf8ebcae22',
  })
  @Expose()
  bikeId: string;

  @ApiProperty({
    description: "Customer's name",
    example: 'John Doe',
  })
  @Expose()
  customerName: string;

  @ApiProperty({
    description: 'Start date of the rental period',
    example: '2025-06-01T00:00:00.000Z',
  })
  @Expose()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the rental period',
    example: '2025-06-03T00:00:00.000Z',
  })
  @Expose()
  endDate: Date;

  @ApiProperty({
    description: 'Current status of the booking',
    enum: BookingStatus,
    example: BookingStatus.confirmed,
  })
  @Expose()
  status: BookingStatus;

  @ApiProperty({
    description: 'Total price for the rental period',
    example: 45.0,
  })
  @Expose()
  totalPrice: number;
}
