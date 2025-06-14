import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserVerificationTable1749839015874
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_verifications" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL,
        "status" VARCHAR NOT NULL DEFAULT 'pending',
        "verified_at" TIMESTAMP,
        "created_at" TIMESTAMPTZ DEFAULT now(),
        CONSTRAINT "FK_user_verifications_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "user_verifications";
    `);
  }
}
