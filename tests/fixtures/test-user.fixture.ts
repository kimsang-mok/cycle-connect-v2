import { UserRoles } from '@src/modules/user/domain/user.types';
import { VerificationStatus } from '@src/modules/auth/domain/auth.types';
import { DataSource } from 'typeorm';

export async function createTestUser(
  dataSource: DataSource,
  overrides?: Partial<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRoles;
    verificationStatus: VerificationStatus;
    verificationToken: string;
  }>,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const id = overrides?.id ?? crypto.randomUUID();
  const email = overrides?.email ?? 'test@example.com';
  const firstName = overrides?.firstName ?? 'Test';
  const lastName = overrides?.lastName ?? 'User';
  const password = overrides?.password ?? '$2a$10$hashed'; // pre-hashed bcrypt
  const role = overrides?.role ?? UserRoles.customer;
  const verificationStatus =
    overrides?.verificationStatus ?? VerificationStatus.verified;
  const verificationToken =
    overrides?.verificationStatus ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

  await queryRunner.query(
    `INSERT INTO users(id, email, first_name, last_name, password, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
    [id, email, firstName, lastName, password, role],
  );

  await queryRunner.query(
    `INSERT INTO user_verifications(id, user_id, status, token, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, now())`,
    [id, verificationStatus, verificationToken],
  );

  await queryRunner.release();

  return { id, email, password };
}
