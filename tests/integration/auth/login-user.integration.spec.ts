import { INestApplication } from '@nestjs/common';
import { createTestUser } from '@tests/fixtures';
import { createTestModule, clearDatabase } from '@tests/utils';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { VerificationStatus } from '@src/modules/auth/domain/auth.types';

describe('AuthModule - Login Scenarios', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const endpoint = '/v1/auth/login';

  const password = 'Secret123';
  let hashedPassword: string;

  beforeAll(async () => {
    const testContext = await createTestModule();
    app = testContext.app;
    dataSource = testContext.dataSource;
    hashedPassword = await bcrypt.hash(password, 10);
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await app.close();
  });

  it('should login successfully when user is verified', async () => {
    const email = 'verified@example.com';

    await createTestUser(dataSource, {
      email,
      password: hashedPassword,
      verificationStatus: VerificationStatus.verified,
    });

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send({ email, password })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
  });

  it('should fail with invalid credentials', async () => {
    const email = 'wrongpass@example.com';

    await createTestUser(dataSource, {
      email,
      password: hashedPassword,
      verificationStatus: VerificationStatus.verified,
    });

    await request(app.getHttpServer())
      .post(endpoint)
      .send({ email, password: 'WrongPassword' })
      .expect(401);
  });

  it('should fail if user is not verified', async () => {
    const email = 'unverified@example.com';

    await createTestUser(dataSource, {
      email,
      password: hashedPassword,
      verificationStatus: VerificationStatus.pending,
    });

    await request(app.getHttpServer())
      .post(endpoint)
      .send({ email, password })
      .expect(403);
  });

  it('should fail if user does not exist', async () => {
    await request(app.getHttpServer())
      .post(endpoint)
      .send({ email: 'notfound@example.com', password })
      .expect(404);
  });
});
