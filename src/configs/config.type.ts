import { DatabaseConfig } from 'database/configs/database-config.type';
import { AppConfig } from './app.config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};
