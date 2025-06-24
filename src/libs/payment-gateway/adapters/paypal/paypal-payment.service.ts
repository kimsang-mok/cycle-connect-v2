import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  AuthorizeResult,
  AuthorizeProps,
  CaptureProps,
  CaptureResult,
  PaymentGatewayServicePort,
} from '../../ports/payment-gateway.service.port';

@Injectable()
export class PaypalPaymentService implements PaymentGatewayServicePort {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenEndpoint = '/v1/oauth2/token';
  private readonly createOrderEndpoint = '/v2/checkout/orders';

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

  async authorize(data: AuthorizeProps): Promise<AuthorizeResult> {
    try {
      const token = await this.getAccessToken();

      const { data: order } = await firstValueFrom(
        this.http.post(
          this.createOrderEndpoint,
          {
            intent: 'AUTHORIZE',
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

      const authorizationId =
        order?.purchase_units?.[0]?.payments?.authorizations?.[0]?.id;

      return {
        success: !!authorizationId,
        authorizationId,
        reason: authorizationId
          ? undefined
          : 'Authorization ID missing from response',
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

  async capture(data: CaptureProps): Promise<CaptureResult> {
    try {
      const token = await this.getAccessToken();

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
