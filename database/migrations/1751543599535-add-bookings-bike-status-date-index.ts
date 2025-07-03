import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingsBikeStatusDateIndex1751543599535
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_bookings_bike_status_dates"
      ON "bookings" ("bike_id", "status", "start_date", "end_date");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_bookings_bike_status_dates";
    `);
  }
}
