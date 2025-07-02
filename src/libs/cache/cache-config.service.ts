import { Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  createCacheOptions(): CacheModuleOptions | Promise<CacheModuleOptions> {
    return {
      store: redisStore,
      host: this.configService.get('cache.host', { infer: true }),
      port: this.configService.get('cache.port', { infer: true }),
      ttl: this.configService.get('cache.ttl', { infer: true }),
      password: this.configService.get('cache.password', { infer: true }),
      db: this.configService.get('cache.db', { infer: true }),
    };
  }
}
