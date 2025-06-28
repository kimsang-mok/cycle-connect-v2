import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  CaptureProps,
  CaptureResult,
  PaymentGatewayServicePort,
  CreateOrderProps,
  CreateOrderResult,
  AuthorizeResult,
} from '../../ports/payment-gateway.service.port';

@Injectable()
export class PaypalPaymentService implements PaymentGatewayServicePort {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenEndpoint = '/v1/oauth2/token';
  private readonly createOrderEndpoint = '/v2/checkout/orders';

  private authorizeEnpoint(orderId: string): string {
    return `/v2/checkout/orders/${orderId}/authorize`;
  }

  constructor(
    private readonly http: HttpService,
    readonly configService: ConfigService<AllConfigType>,
  ) {
    this.clientId = configService.getOrThrow('payment.clientId', {
      infer: true,
    });
    this.clientSecret = configService.getOrThrow('payment.clientSecret', {
      infer: true,
    });
  }

  private async getAccessToken(): Promise<string> {
    const authConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
    };

    const { data } = await firstValueFrom(
      this.http.post(
        this.tokenEndpoint,
        'grant_type=client_credentials',
        authConfig,
      ),
    );

    return data.access_token;
  }

  async createOrder(data: CreateOrderProps): Promise<CreateOrderResult> {
    try {
      const token = await this.getAccessToken();

      const { data: order } = await firstValueFrom(
        this.http.post(
          this.createOrderEndpoint,
          {
            intent: 'AUTHORIZE',
            application_context: {
              brand_name: this.configService.getOrThrow('app.name', {
                infer: true,
              }),
              shipping_preference: 'NO_SHIPPING',
              return_url: `${this.configService.getOrThrow('app.frontendDomain', { infer: true })}/checkout/success`,
              cancel_url: `${this.configService.getOrThrow('app.frontendDomain', { infer: true })}/checkout/cancel`,
            },
            purchase_units: [
              {
                reference_id: data.orderId,
                amount: {
                  currency_code: 'USD',
                  value: data.amount.toFixed(2),
                },
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      const paypalOrderId = order?.id;

      return {
        success: !!paypalOrderId,
        paypalOrderId,
        reason: paypalOrderId ? undefined : 'Missing order Id from PayPal',
      };
    } catch (error: any) {
      const reason =
        error.response?.data?.message ||
        error.response?.data?.error_description ||
        error.message;

      return {
        success: false,
        reason,
      };
    }
  }

  async getAuthorizationId(orderId: string): Promise<AuthorizeResult> {
    try {
      const token = await this.getAccessToken();

      const { data: order } = await firstValueFrom(
        this.http.post(
          this.authorizeEnpoint(orderId),
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      const authorizationId =
        order?.purchase_units?.[0]?.payments?.authorizations?.[0]?.id;

      return {
        success: !!authorizationId,
        authorizationId: authorizationId,
      };
    } catch (error: any) {
      const reason =
        error.response?.data?.message ||
        error.response?.data?.details?.[0]?.issue ||
        error.response?.data?.error_description ||
        error.message;
      console.error('Failed to authorize payment with PayPal: ', reason);

      return {
        success: false,
        authorizationId: undefined,
        reason,
      };
    }
  }

  async capture(data: CaptureProps): Promise<CaptureResult> {
    try {
      const token = await this.getAccessToken();

      console.log('Data: ', data);
      const { data: captureData } = await firstValueFrom(
        this.http.post(
          `/v2/payments/authorizations/${data.authorizationId}/capture`,
          {
            amount: {
              currency_code: 'USD',
              value: data.amount.toFixed(2),
            },
            final_capture: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );
      console.log('data', data);

      return {
        success: true,
        transactionId: captureData?.id,
      };
    } catch (error: any) {
      const reason =
        error.response?.data?.message ||
        error.response?.data?.error_description ||
        error.message;

      return {
        success: false,
        reason,
      };
    }
  }
}
