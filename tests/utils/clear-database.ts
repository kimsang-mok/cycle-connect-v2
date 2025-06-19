import { DataSource } from 'typeorm';

/**
 * truncates all user tables in the public schema (except 'migrations').
 *
 * this is used to clear the database between tests.
 * tt resets IDs and cascades deletions to handle foreign keys.
 */
export async function clearDatabase(dataSource: DataSource): Promise<void> {
  if (!dataSource.isInitialized) {
    throw new Error('DataSource is not initialized');
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const tableNames: { tablename: string }[] = await queryRunner.query(`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public';
  `);

  await queryRunner.query('SET session_replication_role = replica;');

  for (const { tablename } of tableNames) {
    if (tablename !== 'migrations') {
      await queryRunner.query(
        `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`,
      );
    }
  }

  await queryRunner.query('SET session_replication_role = origin;');
  await queryRunner.release();
}
