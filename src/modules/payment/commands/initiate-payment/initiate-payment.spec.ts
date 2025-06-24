import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { InitiatePaymentService } from './initiate-payment.service';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import { BookingRepositoryPort } from '@src/modules/booking/database/ports/booking.repository.port';
import {
  mockAggregateRoot,
  mockInterface,
  mockValueObject,
} from '@tests/utils';
import { InitiatePaymentCommand } from './initiate-payment.command';
import { PaymentMethod } from '../../domain/payment.types';
import { BookingNotFoundError } from '@src/modules/booking/booking.errors';
import { BookingEntity } from '@src/modules/booking/domain/booking.entity';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import {
  InvalidPaymentAmountError,
  PaymentAuthorizationFailedError,
} from '../../payment.errors';
import { PaymentEntity } from '../../domain/payment.entity';

describe('InitiatePaymentService', () => {
  let service: InitiatePaymentService;
  let gatewayService: jest.Mocked<PaymentGatewayServicePort>;
  let paymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let bookingRepo: jest.Mocked<BookingRepositoryPort>;

  const commandProps = {
    bookingId: 'booking-id',
    orderId: 'order-id',
    amount: 10,
    method: PaymentMethod.creditCard,
  };

  const command = new InitiatePaymentCommand(commandProps);

  const mockBooking = mockAggregateRoot(BookingEntity, {
    totalPrice: mockValueObject(Price, {
      overrides: {},
      value: 10,
    }),
  });

  beforeEach(() => {
    gatewayService = mockInterface<PaymentGatewayServicePort>();

    paymentRepo = mockInterface<PaymentRepositoryPort>();

    bookingRepo = mockInterface<BookingRepositoryPort>();

    service = new InitiatePaymentService(
      gatewayService,
      paymentRepo,
      bookingRepo,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw BookingNotFoundError if booking does not exist', async () => {
    bookingRepo.findOneById.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(
      BookingNotFoundError,
    );
  });

  it("should throw InvalidPaymentAmountError if the paid amount is different from booking's totalPrice", async () => {
    const invalidAmountCommand = new InitiatePaymentCommand({
      ...commandProps,
      amount: 12,
    });

    bookingRepo.findOneById.mockResolvedValue(mockBooking);

    await expect(service.execute(invalidAmountCommand)).rejects.toThrow(
      InvalidPaymentAmountError,
    );
  });

  it('should authorize payment successfully', async () => {
    bookingRepo.findOneById.mockResolvedValue(mockBooking);

    const mockPayment = mockAggregateRoot(PaymentEntity, { id: 'mock-id' });

    jest.spyOn(PaymentEntity, 'create').mockReturnValue(mockPayment);

    const mockAuthorizationId = 'authorization-id';

    gatewayService.authorize.mockResolvedValue({
      success: true,
      authorizationId: mockAuthorizationId,
    });

    const result = await service.execute(command);

    expect(result).toMatchObject({ success: true, id: mockPayment.id });
    expect(mockPayment.markAuthorized).toHaveBeenCalledWith(
      mockAuthorizationId,
    );
    expect(paymentRepo.insert).toHaveBeenCalledWith(mockPayment);
  });

  it('should return failed result if authorization failed', async () => {
    bookingRepo.findOneById.mockResolvedValue(mockBooking);
    gatewayService.authorize.mockResolvedValue({
      success: false,
      reason: 'Declined',
    });

    const result = await service.execute(command);

    expect(result.success).toBe(false);
    expect(result.id).toBeDefined();
    expect((result as any).error).toBeInstanceOf(
      PaymentAuthorizationFailedError,
    );
    expect(paymentRepo.insert).toHaveBeenCalled();
  });
});
