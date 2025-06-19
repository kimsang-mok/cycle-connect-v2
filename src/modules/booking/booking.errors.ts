import { HttpStatus } from '@nestjs/common';
import { defineDomainError } from '@src/libs/exceptions';

export const CannotCancelBookingError = defineDomainError({
  message: 'Cannot cancel a completed or already cancelled booking',
  code: 'BOOKING.CANNOT_CANCEL',
  status: HttpStatus.CONFLICT,
});
