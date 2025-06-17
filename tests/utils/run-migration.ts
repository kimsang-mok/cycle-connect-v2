import { execSync } from 'child_process';

export function runMigrations() {
  console.log('[migration] Running database migrations...');

  try {
    execSync(
      `node -r ts-node/register -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=database/data-source.ts migration:run`,
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_HOST: process.env.DATABASE_HOST,
          DATABASE_PORT: process.env.DATABASE_PORT,
        },
      },
    );
    console.log('[migration] Migrations completed');
  } catch (error) {
    console.error('[migration] Migrations failed');
    console.error(error.message || error);
    throw error;
  }
}
