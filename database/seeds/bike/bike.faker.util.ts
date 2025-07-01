import { faker } from '@faker-js/faker';
import { BikeTypes } from '@src/modules/bike/domain/bike.types';

const bikeTypes = Object.values(BikeTypes);

export function randomBikeType(): BikeTypes {
  return faker.helpers.arrayElement(bikeTypes);
}

export function randomEnginePower(): number {
  return faker.number.int({ min: 50, max: 500 });
}

export function randomBikeModel(): string {
  const brand = faker.vehicle.manufacturer();
  const model = faker.vehicle.model();
  return `${brand} ${model}`;
}

export function randomPricePerDay(): number {
  return faker.number.float({ min: 5, max: 50, fractionDigits: 2 });
}

export function randomBikeDescription(): string {
  return faker.lorem.sentence();
}
