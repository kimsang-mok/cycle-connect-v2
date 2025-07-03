import { DataSource } from 'typeorm';
import { BikeTypes } from '@src/modules/bike/domain/bike.types';

export async function createTestBike(
  dataSource: DataSource,
  overrides?: Partial<{
    id: string;
    ownerId: string;
    type: string;
    model: string;
    enginePower: number;
    pricePerDay: number;
    description: string;
    isActive: boolean;
    photoKeys: string[];
    thumbnailKey: string;
    districtCode: number;
  }>,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const id = overrides?.id ?? crypto.randomUUID();
  const ownerId = overrides?.ownerId ?? crypto.randomUUID(); // Replace with a real user ID if needed
  const type = overrides?.type ?? BikeTypes.motorbike;
  const model = overrides?.model ?? 'Yamaha X1';
  const enginePower = overrides?.enginePower ?? 125;
  const pricePerDay = overrides?.pricePerDay ?? 12.5;
  const description =
    overrides?.description ?? 'A fast and lightweight scooter';
  const isActive = overrides?.isActive ?? true;
  const photoKeys = overrides?.photoKeys ?? ['photo1.jpg', 'photo2.jpg'];
  const thumbnailKey = overrides?.thumbnailKey ?? 'photo1.jpg';
  const districtCode = overrides?.districtCode ?? 1204;

  await queryRunner.query(
    `INSERT INTO bikes(
      id, owner_id, type, model, engine_power, price_per_day,
      description, is_active, photo_keys, thumbnail_key, district_code,
      created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11
      now(), now()
    )`,
    [
      id,
      ownerId,
      type,
      model,
      enginePower,
      pricePerDay,
      description,
      isActive,
      photoKeys,
      thumbnailKey,
      districtCode,
    ],
  );

  await queryRunner.release();

  return {
    id,
    ownerId,
    type,
    model,
    enginePower,
    pricePerDay,
    description,
    isActive,
    photoKeys,
    thumbnailKey,
  };
}
