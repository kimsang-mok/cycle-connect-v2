import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionTable1749964550079 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "created_at" TIMESTAMPTZ DEFAULT now(),
            "updated_at" TIMESTAMPTZ DEFAULT now(),
            "user_id" UUID NOT NULL,
            "access_token" VARCHAR NOT NULL,
            "refresh_token" VARCHAR NOT NULL,
            CONSTRAINT "FK_sessions_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        );    
    `);

    // unique composite index on (access_token, refresh_token)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_sessions_access_refresh_token" ON "sessions" ("access_token", "refresh_token");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_sessions_access_refresh_token";
    `);

    await queryRunner.query(`
        DROP TABLE "sessions";    
    `);
  }
}
