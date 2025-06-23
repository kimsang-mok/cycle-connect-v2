export type PaymentGatewayConfig = {
  gateway: 'mock' | 'paypal' | 'strip';
  currency?: string;
  host?: string;
  environment?: string;
  clientId?: string;
  clientSecret?: string;
};
