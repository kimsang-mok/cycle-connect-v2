import {
  mockAggregateRoot,
  mockInterface,
  mockValueObject,
} from '@tests/utils';
import { AuthorizePaymentService } from './authorize-payment.service';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { AuthorizePaymentCommand } from './authorize-payment.command';
import { PaymentEntity } from '../../domain/payment.entity';
import {
  InvalidStateTransitionError,
  PaymentAuthorizationFailedError,
  PaymentNotFoundError,
} from '../../payment.errors';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

describe('AuthorizePaymentService', () => {
  let service: AuthorizePaymentService;
  let gatewayService: jest.Mocked<PaymentGatewayServicePort>;
  let paymentRepo: jest.Mocked<PaymentRepositoryPort>;

  const commandProps = {
    orderId: 'order-id',
  };

  const mockPaymentId = 'payment-id';

  const command = new AuthorizePaymentCommand(commandProps);

  const mockPayment = mockAggregateRoot(PaymentEntity, {
    id: mockPaymentId,
    status: mockValueObject(PaymentStatus, {
      overrides: {
        is: jest.fn().mockResolvedValue(true),
      },
    }),
  });

  beforeEach(() => {
    gatewayService = mockInterface<PaymentGatewayServicePort>();

    paymentRepo = mockInterface<PaymentRepositoryPort>();

    service = new AuthorizePaymentService(paymentRepo, gatewayService);

    paymentRepo.findOneByOrderId.mockResolvedValue(mockPayment);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw PaymentNotFoundError if payment does not exist', async () => {
    paymentRepo.findOneByOrderId.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(
      PaymentNotFoundError,
    );
  });

  it("should throw InvalidStateTransitionError if payment status is not 'pending'", async () => {
    paymentRepo.findOneByOrderId.mockResolvedValue(
      mockAggregateRoot(PaymentEntity, {
        status: mockValueObject(PaymentStatus, {
          overrides: {
            is: jest.fn().mockReturnValue(false),
          },
        }),
      }),
    );

    await expect(service.execute(command)).rejects.toThrow(
      InvalidStateTransitionError,
    );
  });

  it('should throw PaymentAuthorizationFailedError if gateway cannot retrieve authorizationId', async () => {
    gatewayService.getAuthorizationId.mockResolvedValue({
      success: false,
      authorizationId: undefined,
    });

    await expect(service.execute(command)).rejects.toThrow(
      PaymentAuthorizationFailedError,
    );
  });

  it('should successfully authorize the payment', async () => {
    const mockAuthorizationId = 'authorization-id';

    gatewayService.getAuthorizationId.mockResolvedValue({
      success: true,
      authorizationId: mockAuthorizationId,
    });

    const result = await service.execute(command);

    expect(result).toBe(mockPaymentId);
    expect(mockPayment.markAuthorized).toHaveBeenCalledWith(
      mockAuthorizationId,
    );
    expect(paymentRepo.update).toHaveBeenCalledWith(mockPayment);
  });
});
