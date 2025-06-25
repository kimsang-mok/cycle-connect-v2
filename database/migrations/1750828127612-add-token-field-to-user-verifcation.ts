import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenFieldToUserVerifcation1750828127612
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_verifications"
      ADD COLUMN "token" VARCHAR;
    `);

    // backfill default values for existing records
    await queryRunner.query(`
      UPDATE "user_verifications"
      SET "token" = 'none'
      WHERE "token" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_verifications"
      ALTER COLUMN "token" SET NOT NULL;    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_verifications"
      DROP COLUMN "token";
    `);
  }
}
