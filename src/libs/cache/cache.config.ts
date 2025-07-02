import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from '@src/libs/utils/validate-config';
import { CacheConfig } from './cache-config.type';

export class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  CACHE_HOST: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(65535)
  CACHE_PORT: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(86400)
  @IsOptional()
  CACHE_TTL: number;

  @IsString()
  @IsOptional()
  CACHE_PASSWORD?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @IsOptional()
  CACHE_DB: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10000)
  CACHE_MAX_CONNECTIONS: number;
}

export default registerAs<CacheConfig>('cache', () => {
  const validatedEnv = validateConfig(
    process.env,
    EnvironmentVariablesValidator,
  );

  return {
    host: validatedEnv.CACHE_HOST ?? 'localhost',
    port: validatedEnv.CACHE_PORT ?? 6379,
    ttl: validatedEnv.CACHE_TTL ?? 60, // default 60 seconds,
    password: validatedEnv.CACHE_PASSWORD ?? undefined,
    db: validatedEnv.CACHE_DB ?? 0, // default Redis DB 0,
    maxConnections: validatedEnv.CACHE_MAX_CONNECTIONS,
  };
});
