import { PaymentMethod } from '@src/modules/payment/domain/payment.types';

export interface CreateOrderProps {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface CreateOrderResult {
  success: boolean;
  paypalOrderId?: string;
  reason?: string;
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
  createOrder(data: CreateOrderProps): Promise<CreateOrderResult>;
  getAuthorizationId(orderId: string): Promise<AuthorizeResult>;
  capture(data: CaptureProps): Promise<CaptureResult>;
}
