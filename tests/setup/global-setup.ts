import { runMigrations } from '../utils/run-migration';
import { createTestContext } from '../../test-container/core/create-test-context';
import '../../test-container/preset/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

const context = createTestContext([
  {
    name: 'postgres',
    options: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : 5432,
    },
  },
]);

globalThis.__TEST_CONTEXT__ = context;

export default async () => {
  await context.startAll();
  const pg = context.getContainer('postgres');

  process.env.DATABASE_HOST = pg.getHost();
  process.env.DATABASE_PORT = pg.getMappedPort(5432).toString();

  runMigrations();
};
