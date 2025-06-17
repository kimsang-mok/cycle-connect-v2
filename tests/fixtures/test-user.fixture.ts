import { UserRoles } from '@src/modules/user/domain/user.types';
import { VerificationStatus } from '@src/modules/auth/domain/auth.types';
import { DataSource } from 'typeorm';

export async function createTestUser(
  dataSource: DataSource,
  overrides?: Partial<{
    id: string;
    email: string;
    password: string;
    role: UserRoles;
    verificationStatus: VerificationStatus;
  }>,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const userId = overrides?.id ?? crypto.randomUUID();
  const email = overrides?.email ?? 'test@example.com';
  const password = overrides?.password ?? '$2a$10$hashed'; // pre-hashed bcrypt
  const role = overrides?.role ?? UserRoles.customer;
  const verificationStatus =
    overrides?.verificationStatus ?? VerificationStatus.verified;

  await queryRunner.query(
    `INSERT INTO users(id, email, password, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, now(), now())`,
    [userId, email, password, role],
  );

  await queryRunner.query(
    `INSERT INTO user_verifications(id, user_id, status, created_at)
     VALUES (gen_random_uuid(), $1, $2, now())`,
    [userId, verificationStatus],
  );

  await queryRunner.release();

  return { userId, email, password };
}
