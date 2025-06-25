import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameFieldsToUser1750820778666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "first_name" VARCHAR,
      ADD COLUMN "last_name" VARCHAR;   
    `);

    // backfill default values for existing records
    await queryRunner.query(`
      UPDATE "users"
      SET "first_name" = 'Unknown', "last_name" = 'User'
      WHERE "first_name" IS NULL or "last_name" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "first_name" SET NOT NULL,
      ALTER COLUMN "last_name" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "first_name",
      DROP COLUMN "last_name";
    `);
  }
}
