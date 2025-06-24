import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentTable1750649315309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "booking_id" UUID NOT NULL,
        "order_id" VARCHAR NOT NULL,
        "amount" NUMERIC(10, 2) NOT NULL,
        "method" VARCHAR NOT NULL,
        "status" VARCHAR NOT NULL,
        "failure_reason" TEXT,
        "authorization_id" VARCHAR,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_payments_booking_id_bookings_id" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
      );

      CREATE INDEX "IDX_payments_authorization_id" ON "payments" ("authorization_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_payments_authorization_id";
      DROP TABLE IF EXISTS "payments";
    `);
  }
}
