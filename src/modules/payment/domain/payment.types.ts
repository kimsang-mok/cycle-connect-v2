/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { PaymentStatus } from './value-objects/payment-status.value-object';

export interface PaymentProps {
  orderId: string;
  authorizationId?: string;
  bookingId: string;
  status: PaymentStatus;
  amount: Price;
  method: PaymentMethod;
}

export enum PaymentMethod {
  creditCard = 'credit_card',
  paypal = 'paypal',
}

export enum PaymentStatusType {
  initiated = 'initiated',
  pending = 'pending',
  authorized = 'authorized',
  succeeded = 'succeeded',
  failed = 'failed',
}

export interface CreatePaymentProps
  extends Omit<PaymentProps, 'status' | 'orderId'> {}
