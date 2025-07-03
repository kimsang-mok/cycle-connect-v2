import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistrictCodeToBikes1751475630371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "bikes"
      ADD COLUMN "district_code" INT;    
    `);

    await queryRunner.query(`
      UPDATE "bikes"
      SET "district_code" = 1204
      WHERE "district_code" IS NULL;    
    `);

    await queryRunner.query(`
      ALTER TABLE "bikes"
      ALTER COLUMN "district_code" SET NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_bikes_district_code" ON "bikes" ("district_code");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_bikes_district_code";
    `);
    await queryRunner.query(`
      ALTER TABLE "bikes"
      DROP COLUMN "district_code";
    `);
  }
}
