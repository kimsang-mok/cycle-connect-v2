import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBikeSearchVector1750525061053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "bikes"
      ADD COLUMN "search_vector" tsvector;

      CREATE INDEX bikes_search_vector_idx
      ON "bikes"
      USING GIN ("search_vector");

      CREATE FUNCTION bikes_search_vector_update() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          to_tsvector('english', coalesce(NEW.model, '') || ' ' || coalesce(NEW.description, ''));
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER bikes_search_vector_trigger
      BEFORE INSERT OR UPDATE ON "bikes"
      FOR EACH ROW
      EXECUTE FUNCTION bikes_search_vector_update();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS bikes_search_vector_trigger ON "bikes";
      DROP FUNCTION IF EXISTS bikes_search_vector_update;
      DROP INDEX IF EXISTS bikes_search_vector_idx;
      ALTER TABLE "bikes" DROP COLUMN "search_vector";
    `);
  }
}
