import { DatabaseConfig } from 'database/configs/database-config.type';
import { AppConfig } from './app.config.type';
import { AuthConfig } from '@src/modules/auth/config/auth-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};
