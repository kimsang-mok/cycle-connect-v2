import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppRequestContext,
  ContextInterceptor,
} from './libs/application/context';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configs/app.config';
import databaseConfig from '../database/configs/database.config';
import { TypeOrmConfigService } from '../database/configs/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  AllExceptionsFilter,
  DomainExceptionFilter,
  ValidationExceptionFilter,
} from './libs/application/filters';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

const filters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ValidationExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: DomainExceptionFilter,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    CqrsModule,

    // Modules
    UserModule,
  ],
  controllers: [],
  providers: [AppRequestContext, ...filters, ...interceptors],
})
export class AppModule {}
