import { INestApplication } from '@nestjs/common';
import { CreateBookingRequestDto } from '@src/modules/booking/commands/create-booking/create-booking.request.dto';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { createTestBike, createTestUser } from '@tests/fixtures';
import { clearDatabase, createTestModule } from '@tests/utils';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import {
  BikeInactiveError,
  BikeNotAvailableError,
  BikeNotFoundError,
} from '@src/modules/bike/bike.errors';
import { createBooking } from '@tests/fixtures/test-booking.fixture';

describe('BookingModule - Create Booking Scenarios', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let renterId: string;

  const endpoint = '/v1/bookings';

  const createBookingDto: CreateBookingRequestDto = {
    bikeId: '',
    customerName: 'John Doe',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-03'),
  };

  beforeAll(async () => {
    const testContext = await createTestModule();
    app = testContext.app;
    dataSource = testContext.dataSource;

    const renter = await createTestUser(dataSource, {
      email: 'renter@example.com',
      role: UserRoles.renter,
    });

    renterId = renter.id;
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await app.close();
  });

  it('should create a booking successfully', async () => {
    const { id: bikeId } = await createTestBike(dataSource, {
      id: crypto.randomUUID(),
      ownerId: renterId,
    });

    const response = await request(app.getHttpServer())
      .post(endpoint)
      .send({ ...createBookingDto, bikeId: bikeId })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });

  it('should fail when bike is inactive', async () => {
    const { id: inactiveBikeId } = await createTestBike(dataSource, {
      id: crypto.randomUUID(),
      ownerId: renterId,
      isActive: false,
    });

    const response = await request(app.getHttpServer())
      .post(endpoint)
      .send({
        ...createBookingDto,
        bikeId: inactiveBikeId,
      })
      .expect(409);

    expect(response.body.message).toBe(BikeInactiveError.message);
  });

  it('should fail when the bike does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post(endpoint)
      .send({ ...createBookingDto, bikeId: crypto.randomUUID() })
      .expect(404);

    expect(response.body.message).toBe(BikeNotFoundError.message);
  });

  it('should fail if bike is already booked for the given period', async () => {
    const { id: bikeId } = await createTestBike(dataSource, {
      id: crypto.randomUUID(),
      ownerId: renterId,
    });

    await createBooking(dataSource, {
      ...createBookingDto,
      bikeId,
      customerName: 'Another User',
      totalPrice: 30,
    });

    const response = await request(app.getHttpServer())
      .post(endpoint)
      .send({ ...createBookingDto, bikeId })
      .expect(409);

    expect(response.body.message).toBe(BikeNotAvailableError.message);
  });
});
