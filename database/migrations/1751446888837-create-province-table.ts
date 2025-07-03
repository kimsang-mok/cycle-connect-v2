import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProvinceTable1751446888837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "provinces" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "type" VARCHAR(255) NOT NULL,
        "code" INT NOT NULL,
        "name_km" VARCHAR(255) NOT NULL,
        "name_en" VARCHAR(255) NOT NULL,
        CONSTRAINT "UQ_provinces_code" UNIQUE ("code")
      );   
    `);

    await queryRunner.query(`
      INSERT INTO "provinces" ("type", "code", "name_km", "name_en") VALUES
      ('ខេត្ត​', 1, 'បន្ទាយមានជ័យ', 'Banteay Meanchey'),
      ('ខេត្ត​', 2, 'បាត់ដំបង', 'Battambang'),
      ('ខេត្ត​', 3, 'កំពង់ចាម', 'Kampong Cham'),
      ('ខេត្ត​', 4, 'កំពង់ឆ្នាំង', 'Kampong Chhnang'),
      ('ខេត្ត​', 5, 'កំពង់ស្ពឺ', 'Kampong Speu'),
      ('ខេត្ត​', 6, 'កំពង់ធំ', 'Kampong Thom'),
      ('ខេត្ត​', 7, 'កំពត', 'Kampot'),
      ('ខេត្ត​', 8, 'កណ្ដាល', 'Kandal'),
      ('ខេត្ត​', 9, 'កោះកុង', 'Koh Kong'),
      ('ខេត្ត​', 10, 'ក្រចេះ', 'Kratie'),
      ('ខេត្ត​', 11, 'មណ្ឌលគិរី', 'Mondul Kiri'),
      ('ខេត្ត​', 12, 'រាជធានីភ្នំពេញ', 'Phnom Penh'),
      ('ខេត្ត​', 13, 'ព្រះវិហារ', 'Preah Vihear'),
      ('ខេត្ត​', 14, 'ព្រៃវែង', 'Prey Veng'),
      ('ខេត្ត​', 15, 'ពោធិ៍សាត់', 'Pursat'),
      ('ខេត្ត​', 16, 'រតនគិរី', 'Ratanak Kiri'),
      ('ខេត្ត​', 17, 'សៀមរាប', 'Siemreap'),
      ('ខេត្ត​', 18, 'ព្រះសីហនុ', 'Preah Sihanouk'),
      ('ខេត្ត​', 19, 'ស្ទឹងត្រែង', 'Stung Treng'),
      ('ខេត្ត​', 20, 'ស្វាយរៀង', 'Svay Rieng'),
      ('ខេត្ត​', 21, 'តាកែវ', 'Takeo'),
      ('ខេត្ត​', 22, 'ឧត្ដរមានជ័យ', 'Oddar Meanchey'),
      ('ខេត្ត​', 23, 'កែប', 'Kep'),
      ('ខេត្ត​', 24, 'ប៉ៃលិន', 'Pailin'),
      ('ខេត្ត​', 25, 'ត្បូងឃ្មុំ', 'Tboung Khmum');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "provinces";
    `);
  }
}
