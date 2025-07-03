import { BikeOrmEntity } from '@src/modules/bike/database/bike.orm-entity';
import {
  randomBikeDescription,
  randomBikeModel,
  randomBikeType,
  randomDistrictCode,
  randomEnginePower,
  randomPricePerDay,
} from './bike.faker.util';
import { BikeTypes } from '@src/modules/bike/domain/bike.types';

interface BikeSeedProps {
  ownerId: string;
  type?: BikeTypes;
  model?: string;
  enginePower?: number;
  pricePerDay?: number;
  description?: string;
  isActive?: boolean;
  photoKeys?: string[];
  thumbnailKey?: string;
  districtCode?: number;
}

export function createBikeSeed(props: BikeSeedProps): BikeOrmEntity {
  const bike = new BikeOrmEntity();

  bike.id = crypto.randomUUID();
  bike.ownerId = props.ownerId;
  bike.type = props.type ?? randomBikeType();
  bike.model = props.model ?? randomBikeModel();
  bike.enginePower = props.enginePower ?? randomEnginePower();
  bike.pricePerDay = props.pricePerDay ?? randomPricePerDay();
  bike.description = props.description ?? randomBikeDescription();
  bike.isActive = props.isActive ?? true;
  bike.photoKeys = props.photoKeys ?? [];
  bike.thumbnailKey = props.thumbnailKey ?? '';
  bike.districtCode = props.districtCode ?? randomDistrictCode();
  bike.createdAt = new Date();
  bike.updatedAt = new Date();

  return bike;
}
