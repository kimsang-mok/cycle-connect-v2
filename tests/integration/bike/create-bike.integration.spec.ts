import { INestApplication } from '@nestjs/common';
import { BikeTypes } from '@src/modules/bike/domain/bike.types';
import { createTestModule, clearDatabase } from '@tests/utils';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { CreateBikeRequestDto } from '@src/modules/bike/commands/create-bike/create-bike.request.dto';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { createTestUser } from '@tests/fixtures';
import { MockJwtAuthGuard } from '@tests/mocks/mock-auth.guard';

describe('BikeModule - Create Bike Scenarios', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const endpoint = '/v1/bikes';

  const createBikeDto: CreateBikeRequestDto = {
    type: BikeTypes.motorbike,
    model: 'Honda Wave',
    enginePower: 125,
    description: 'Economical and easy to ride',
    pricePerDay: 12.5,
    photoKeys: ['uploads/test-user/photo1.jpg'],
    thumbnailKey: 'uploads/test-user/photo1.jpg',
  };

  beforeAll(async () => {
    const testContext = await createTestModule();
    app = testContext.app;
    dataSource = testContext.dataSource;

    const renter = await createTestUser(dataSource, {
      email: 'renter@example.com',
      role: UserRoles.renter,
    });

    MockJwtAuthGuard.user.id = renter.userId;
    MockJwtAuthGuard.user.role = UserRoles.renter;
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await app.close();
  });

  it('should create a new bike and return its id', async () => {
    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createBikeDto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('string');
  });

  it('should fail if thumbnailKey is not in photoKeys', async () => {
    createBikeDto.thumbnailKey = 'uploads/test-user/photo2.jpg';

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createBikeDto)
      .expect(400);

    expect(res.body.error).toBe('GENERIC.ARGUMENT_INVALID');
  });
});
