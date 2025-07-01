import { ApiProperty } from '@nestjs/swagger';
import { BookingResponseDto } from '../../dtos/booking.response.dto';

export class GetActiveBookingsByBikeIdResponseDto {
  @ApiProperty({
    isArray: true,
    type: BookingResponseDto,
  })
  data: BookingResponseDto[];
}
