import {
  mockAggregateRoot,
  mockInterface,
  mockValueObject,
} from '@tests/utils';
import { CaptureFundCommand } from './capture-fund.command';
import { CaptureFundService } from './capture-fund.service';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { PaymentGatewayServicePort } from '@src/libs/payment-gateway/ports/payment-gateway.service.port';
import { BookingRepositoryPort } from '@src/modules/booking/database/ports/booking.repository.port';
import { PaymentRepositoryPort } from '../../database/ports/payment.repository.port';
import {
  CannotCaptureFundError,
  CannotCaptureUnAuthorizedPaymentError,
  CannotChargeUnconfirmedBookingError,
  PaymentNotFoundError,
} from '../../payment.errors';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { PaymentEntity } from '../../domain/payment.entity';
import { BookingStatus } from '@src/modules/booking/domain/booking.types';
import { BookingNotFoundError } from '@src/modules/booking/booking.errors';

describe('CaptureFundService', () => {
  let service: CaptureFundService;
  let gatewayService: jest.Mocked<PaymentGatewayServicePort>;
  let paymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let bookingRepo: jest.Mocked<BookingRepositoryPort>;

  const commandProps = {
    orderId: 'order-id',
    bookingStatus: BookingStatus.confirmed,
  };

  const command = new CaptureFundCommand(commandProps);

  const mockBookingId = 'booking-id';

  const mockAuthorizationId = 'authorization-id';

  const mockPaymentId = 'payment-id';

  const mockPayment = mockAggregateRoot(PaymentEntity, {
    authorizationId: mockAuthorizationId,
    bookingId: mockBookingId,
    status: mockValueObject(PaymentStatus, {
      overrides: {
        is: jest.fn().mockReturnValue(true),
      },
    }),
    amount: mockValueObject(Price),
    id: mockPaymentId,
  });

  beforeEach(() => {
    gatewayService = mockInterface<PaymentGatewayServicePort>();

    paymentRepo = mockInterface<PaymentRepositoryPort>();

    bookingRepo = mockInterface<BookingRepositoryPort>();

    service = new CaptureFundService(paymentRepo, bookingRepo, gatewayService);

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

  it('should throw CannotCaptureUnAuthorizedPaymentError if payment is not authorized', async () => {
    const unauthorizedPayment = mockAggregateRoot(PaymentEntity, {
      status: mockValueObject(PaymentStatus, {
        overrides: {
          is: jest.fn().mockReturnValue(false),
        },
      }),
    });

    paymentRepo.findOneByOrderId.mockResolvedValue(unauthorizedPayment);

    await expect(service.execute(command)).rejects.toThrow(
      CannotCaptureUnAuthorizedPaymentError,
    );
  });

  it('should search for booking when bookingStatus is not present in the command', async () => {
    const _command = new CaptureFundCommand({ orderId: commandProps.orderId });

    await expect(service.execute(_command)).rejects.toThrow(
      BookingNotFoundError,
    );

    expect(bookingRepo.findOneById).toHaveBeenCalledWith(mockBookingId);
  });

  it('should throw CannotChargeUnconfirmedBookingError if booking is not confirmed', async () => {
    const _command = new CaptureFundCommand({
      ...commandProps,
      bookingStatus: BookingStatus.pending,
    });

    await expect(service.execute(_command)).rejects.toThrow(
      CannotChargeUnconfirmedBookingError,
    );
  });

  it('should throw CannotCaptureFundError if fund-capture failed', async () => {
    gatewayService.capture.mockResolvedValue({
      success: false,
      transactionId: undefined,
    });

    await expect(service.execute(command)).rejects.toThrow(
      CannotCaptureFundError,
    );
  });

  it('should successfully capture the fund', async () => {
    gatewayService.capture.mockResolvedValue({
      success: true,
      transactionId: 'transaction-id',
    });

    const result = await service.execute(command);

    expect(result).toBe(mockPaymentId);
    expect(mockPayment.markSucceeded).toHaveBeenCalled();
    expect(paymentRepo.update).toHaveBeenCalledWith(mockPayment);
  });
});
