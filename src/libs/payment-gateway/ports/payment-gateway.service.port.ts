import { PaymentMethod } from '@src/modules/payment/domain/payment.types';

export interface AuthorizeProps {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface AuthorizeResult {
  success: boolean;
  authorizationId?: string;
  reason?: string;
}

export interface CaptureProps {
  authorizationId: string;
  amount: number;
}

export interface CaptureResult {
  success: boolean;
  transactionId?: string;
  reason?: string;
}

export interface PaymentGatewayServicePort {
  authorize(data: AuthorizeProps): Promise<AuthorizeResult>;
  capture(data: CaptureProps): Promise<CaptureResult>;
}
