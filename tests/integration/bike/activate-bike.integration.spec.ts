import { INestApplication } from '@nestjs/common';
import { UserRoles } from '@src/modules/user/domain/user.types';
import { createTestUser, createTestBike } from '@tests/fixtures';
import { MockJwtAuthGuard } from '@tests/mocks/mock-auth.guard';
import { createTestModule, clearDatabase } from '@tests/utils';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

describe('BikeModule - Activate Bike Scenarios', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const endpoint = (id: string) => `/v1/bikes/${id}/activate`;

  let ownerId: string;
  let bikeId: string;

  beforeAll(async () => {
    const testContext = await createTestModule();
    app = testContext.app;
    dataSource = testContext.dataSource;

    const renter = await createTestUser(dataSource, {
      email: 'renter@example.com',
      role: UserRoles.renter,
    });

    ownerId = renter.userId;
    MockJwtAuthGuard.user.id = renter.userId;
    MockJwtAuthGuard.user.role = UserRoles.renter;

    const bike = await createTestBike(dataSource, {
      ownerId,
      isActive: false,
    });

    bikeId = bike.bikeId;
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await app.close();
  });

  it('should activate the bike successfully', async () => {
    const res = await request(app.getHttpServer())
      .patch(endpoint(bikeId))
      .expect(200);

    expect(res.body).toHaveProperty('id', bikeId);
  });

  it('should fail if the bike does not exist', async () => {
    const fakeBikeId = '00000000-0000-0000-0000-000000000000';

    const res = await request(app.getHttpServer())
      .patch(endpoint(fakeBikeId))
      .expect(404);

    expect(res.body.message).toBeDefined();
  });

  it('should fail if the user does not own the bike', async () => {
    const anotherUser = await createTestUser(dataSource, {
      email: 'hacker@example.com',
      role: UserRoles.renter,
    });

    MockJwtAuthGuard.user.id = anotherUser.userId;

    const res = await request(app.getHttpServer())
      .patch(endpoint(bikeId))
      .expect(403);

    expect(res.body.error).toBe('BIKE.FORBIDDEN_OWNERSHIP');
  });
});
