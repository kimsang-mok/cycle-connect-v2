import {
  asMock,
  mockAggregateRoot,
  mockClassMethods,
  mockInterface,
} from '@tests/utils';
import { BookingRepositoryPort } from '../../database/ports/booking.repository.port';
import { CreateBookingService } from './create-booking.service';
import { BikeRepositoryPort } from '@src/modules/bike/database/ports/bike.repository.port';
import { BookingAvailabilityService } from '../../domain/services/booking-availability.service';
import { BookingPricingService } from '../../domain/services/booking-pricing.sevice';
import { CreateBookingCommand } from './create-booking.command';
import { BikeEntity } from '@src/modules/bike/domain/bike.entity';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { BookingEntity } from '../../domain/booking.entity';
import {
  BikeInactiveError,
  BikeNotAvailableError,
  BikeNotFoundError,
} from '@src/modules/bike/bike.errors';

describe('CreateBookingService', () => {
  let service: CreateBookingService;
  let bookingRepo: BookingRepositoryPort;
  let bikeRepo: BikeRepositoryPort;
  let availabilityService: BookingAvailabilityService;
  let pricingService: BookingPricingService;

  const mockCommand = new CreateBookingCommand({
    bikeId: 'bike-1',
    customerName: 'John Doe',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-03'),
  });

  const mockBike = mockAggregateRoot(BikeEntity, {
    id: mockCommand.bikeId,
    pricePerDay: new Price(10),
    isActive: true,
  });

  beforeEach(async () => {
    bookingRepo = mockInterface<BookingRepositoryPort>();
    bikeRepo = mockInterface<BikeRepositoryPort>();
    availabilityService = mockClassMethods(BookingAvailabilityService);
    pricingService = mockClassMethods(BookingPricingService);
    service = new CreateBookingService(
      bookingRepo,
      bikeRepo,
      availabilityService,
      pricingService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create booking successfully, then return its id', async () => {
    const expectedBookingId = 'booking-123';

    asMock(bikeRepo.findOneById).mockResolvedValue(mockBike);
    asMock(availabilityService.isBikeAvailable).mockResolvedValue(true);
    asMock(pricingService.calculateTotalPrice).mockReturnValue(new Price(30));

    const mockBooking = mockAggregateRoot(BookingEntity, {
      id: expectedBookingId,
      bikeId: mockCommand.bikeId,
      customerName: mockCommand.customerName,
      period: expect.anything(),
      totalPrice: new Price(30),
    });

    jest.spyOn(BookingEntity, 'create').mockReturnValue(mockBooking);

    const result = await service.execute(mockCommand);

    expect(result).toBe(expectedBookingId);
    expect(bookingRepo.insert).toHaveBeenCalledWith(mockBooking);
  });

  it('should throw if bike is not found', async () => {
    asMock(bikeRepo.findOneById).mockResolvedValue(null);

    await expect(service.execute(mockCommand)).rejects.toThrow(
      BikeNotFoundError,
    );
    expect(bookingRepo.insert).not.toHaveBeenCalled();
  });

  it('should throw if bike is inactive', async () => {
    const inactiveBike = mockAggregateRoot(BikeEntity, {
      ...mockBike.getProps(),
      isActive: false,
    });
    asMock(bikeRepo.findOneById).mockResolvedValue(inactiveBike);

    await expect(service.execute(mockCommand)).rejects.toThrow(
      BikeInactiveError,
    );
    expect(bookingRepo.insert).not.toHaveBeenCalled();
  });

  it('should throw if bike is not available', async () => {
    asMock(bikeRepo.findOneById).mockResolvedValue(mockBike);
    asMock(availabilityService.isBikeAvailable).mockResolvedValue(false);

    expect(service.execute(mockCommand)).rejects.toThrow(BikeNotAvailableError);
    expect(bookingRepo.insert).not.toHaveBeenCalled();
  });
});
