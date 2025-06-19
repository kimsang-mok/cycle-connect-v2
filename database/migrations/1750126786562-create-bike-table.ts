import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBikeTable1750126786562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "bikes" (
              "id" UUID NOT NULL,
              "owner_id" UUID NOT NULL REFERENCES users(id),
              "type" VARCHAR NOT NULL,
              "model" VARCHAR NOT NULL,
              "engine_power" INTEGER NOT NULL,
              "price_per_day" NUMERIC NOT NULL,
              "description" TEXT NOT NULL,
              "is_active" BOOLEAN NOT NULL DEFAULT true,
              "photo_keys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
              "thumbnail_key" TEXT NOT NULL DEFAULT '',
              "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
              "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
              CONSTRAINT "PK_bikes_id" PRIMARY KEY ("id")
            );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "bikes";    
    `);
  }
}
