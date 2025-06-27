import { HttpStatus } from '@nestjs/common';
import { defineDomainError } from '@src/libs/exceptions';

export const PaymentNotFoundError = defineDomainError({
  message: 'Payment not found',
  code: 'PAYMENT.NOT_FOUND',
  status: HttpStatus.NOT_FOUND,
});

export const InvalidPaymentAmountError = defineDomainError({
  message: 'Payment amount does not match booking total',
  code: 'PAYMENT.INVALID_AMOUNT',
  status: HttpStatus.BAD_REQUEST,
});

export const PaymentAuthorizationFailedError = defineDomainError({
  message: 'Payment authorization failed',
  code: 'PAYMENT.AUTHORIZATION_FAILED',
  status: HttpStatus.BAD_REQUEST,
});

export const CannotCaptureUnAuthorizedPaymentError = defineDomainError({
  message: 'Cannot capture payment that is not authorized',
  code: 'PAYMENT.CANNOT_CAPTURE_UNAUTHORIZED',
  status: HttpStatus.CONFLICT,
});

export const CannotCreateOrderError = defineDomainError({
  message: 'Cannot create an order',
  code: 'PAYMENT.CANNOT_CREATE_ORDER',
  status: HttpStatus.BAD_REQUEST,
});
