import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistrictCodeToBikes1751475630371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "bikes"
      ADD COLUMN "district_code" INT;    
    `);

    const bikes = await queryRunner.query(`
      SELECT id FROM "bikes" WHERE "district_code" IS NULL;
    `);

    const districtCodes = [1702, 1710, 707, 708, 1201, 1204];

    // randomly assign district_code for each bike
    for (const bike of bikes) {
      const randomCode =
        districtCodes[Math.floor(Math.random() * districtCodes.length)];
      await queryRunner.query(
        `UPDATE "bikes" 
        SET "district_code" = $1 WHERE "id" = $2;`,
        [randomCode, bike.id],
      );
    }

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
