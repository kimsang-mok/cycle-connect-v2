import { DataSource } from 'typeorm';
import { SeederPort } from '../seeder.port';
import { BikeOrmEntity } from '@src/modules/bike/database/bike.orm-entity';
import { createBikeSeed } from './bike.seed.factory';

export class BikeSeeder implements SeederPort {
  name = 'bikes';
  dependencies = ['users'];

  async seed(
    dataSource: DataSource,
    context: Record<string, any>,
  ): Promise<void> {
    const bikeRepo = dataSource.getRepository(BikeOrmEntity);

    const renterUser = context['renterUser'];
    if (!renterUser) throw new Error('renter user not seeded yet.');

    const count =
      context._targetSeeder === this.name ? (context.count ?? 10) : 1;

    const bikes = Array.from({ length: count }).map(() =>
      createBikeSeed({ ownerId: renterUser.id }),
    );

    await bikeRepo.save(bikes);

    console.log(`seeded ${bikes.length} bikes for user: ${renterUser.email}`);
    context['bikes'] = bikes;
  }
}
