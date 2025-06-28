import {
  AuthorizeResult,
  CaptureProps,
  CaptureResult,
  CreateOrderProps,
  CreateOrderResult,
  PaymentGatewayServicePort,
} from '../../ports/payment-gateway.service.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockPaymentService implements PaymentGatewayServicePort {
  async createOrder(data: CreateOrderProps): Promise<CreateOrderResult> {
    // simulate payment failure
    if (data.amount > 100) {
      return {
        success: false,
        reason: 'Cannot process payment',
      };
    }

    return {
      success: true,
      paypalOrderId: `mock-paypal-order-${data.orderId}`,
    };
  }

  async getAuthorizationId(orderId: string): Promise<AuthorizeResult> {
    return {
      success: true,
      authorizationId: `mock-auth-${orderId}`,
    };
  }

  async capture(data: CaptureProps): Promise<CaptureResult> {
    return {
      success: true,
      transactionId: `mock-capture-${data.authorizationId}`,
    };
  }
}
