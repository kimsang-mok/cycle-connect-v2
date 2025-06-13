import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1749717550412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
            "email" VARCHAR NOT NULL,
            "password" VARCHAR NOT NULL,
            "role" VARCHAR NOT NULL,
            UNIQUE ("email")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "users";    
    `);
  }
}
