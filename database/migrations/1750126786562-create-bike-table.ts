import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBikeTable1750126786562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "bikes" (
              "id" UUID NOT NULL,
              "ownerId" UUID NOT NULL REFERENCES users(id),
              "type" VARCHAR NOT NULL,
              "model" VARCHAR NOT NULL,
              "enginePower" INTEGER NOT NULL,
              "pricePerDay" NUMERIC NOT NULL,
              "description" TEXT NOT NULL,
              "isActive" BOOLEAN NOT NULL DEFAULT true,
              "photoKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
              "thumbnailKey" TEXT NOT NULL DEFAULT '',
              "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
              "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
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
