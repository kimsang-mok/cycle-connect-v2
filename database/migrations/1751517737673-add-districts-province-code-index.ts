import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistrictsProvinceCodeIndex1751517737673
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "idx_districts_province_code" ON "districts" ("province_code");    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "idx_districts_province_code";
    `);
  }
}
