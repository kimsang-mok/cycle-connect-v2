import * as minimist from 'minimist';
import { AppDataSource } from 'database/data-source';
import { UserSeeder } from './user/user.seeder';
import { BikeSeeder } from './bike/bike.seeder';

async function run() {
  const argv = minimist(process.argv.slice(2));
  const entityArg = argv._[0] as string | undefined;
  const count = argv.count ? parseInt(argv.count, 10) : undefined;

  const dataSource = AppDataSource;
  await dataSource.initialize();

  const seeders = [new UserSeeder(), new BikeSeeder()];
  const context: Record<string, any> = { count, _targetSeeder: entityArg };
  const executed = new Set<string>();

  async function executeSeeder(seeder) {
    if (executed.has(seeder.name)) return;

    if (seeder.dependencies) {
      for (const depName of seeder.dependencies) {
        const depSeeder = seeders.find((s) => s.name === depName);
        if (!depSeeder)
          throw new Error(`Missing dependency seeder: ${depName}`);
        await executeSeeder(depSeeder);
      }
    }

    console.log(`running seeder: ${seeder.name} (count=${count})`);
    await seeder.seed(dataSource, context);
    executed.add(seeder.name);
  }

  if (entityArg) {
    const seeder = seeders.find((s) => s.name === entityArg);
    if (!seeder) {
      console.error(`unknown seeder: ${entityArg}`);
      process.exit(1);
    }
    await executeSeeder(seeder);
  } else {
    for (const seeder of seeders) {
      await executeSeeder(seeder);
    }
  }

  await dataSource.destroy();
  console.log('seeding completed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
