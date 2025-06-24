import {
  AuthorizeProps,
  AuthorizeResult,
  CaptureProps,
  CaptureResult,
  PaymentGatewayServicePort,
} from '../../ports/payment-gateway.service.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockPaymentService implements PaymentGatewayServicePort {
  async authorize(data: AuthorizeProps): Promise<AuthorizeResult> {
    // simulate payment failure
    if (data.amount > 100) {
      return {
        success: false,
        reason: 'Cannot process payment',
      };
    }

    return {
      success: true,
      authorizationId: `mock-auth-${data.orderId}`,
    };
  }

  async capture(data: CaptureProps): Promise<CaptureResult> {
    return {
      success: true,
      transactionId: `mock-capture-${data.authorizationId}`,
    };
  }
}
