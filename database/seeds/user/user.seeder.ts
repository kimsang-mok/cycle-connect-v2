import { UserVerificationOrmEntity } from '@src/modules/auth/database/user-verification.orm-entity';
import { SeederPort } from '../seeder.port';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { createUserSeed } from './user-seed.factory';
import { UserRoles } from '@src/modules/user/domain/user.types';

export class UserSeeder implements SeederPort {
  name = 'users';

  async seed(
    dataSource: DataSource,
    context: Record<string, any>,
  ): Promise<void> {
    const userRepo = dataSource.getRepository(UserOrmEntity);
    const verificationRepo = dataSource.getRepository(
      UserVerificationOrmEntity,
    );

    const count =
      context._targetSeeder === this.name ? (context.count ?? 10) : 1;

    const userSeeds = Array.from({ length: count }).map(() =>
      createUserSeed({ role: UserRoles.renter }),
    );

    const users = userSeeds.map((seed) => seed.user);
    const verifications = userSeeds.map((seed) => seed.verification);

    await userRepo.save(users);
    await verificationRepo.save(verifications);

    console.log(`seeded ${users.length} users.`);

    // store first user in context for dependencies (bikes)
    context['renterUser'] = users[0];
  }
}
