import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingTable1750336517329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "bookings" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "bike_id" UUID NOT NULL,
            "customer_name" VARCHAR NOT NULL,
            "start_date" DATE NOT NULL,
            "end_date" DATE NOT NULL,
            "status" VARCHAR NOT NULL DEFAULT 'confirmed',
            "total_price" NUMERIC NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT "FK_bookings_bike_id_bikes_id" FOREIGN KEY ("bike_id") REFERENCES "bikes"("id") 
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "bookings";
    `);
  }
}
