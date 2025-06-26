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
import { AuthModule } from './modules/auth/auth.module';
import authConfig from './modules/auth/config/auth.config';
import mailerConfig from './libs/mailer/config/mailer.config';
import { NotificationModule } from './modules/notification/notification.module';
import { getEnvFilePath } from './libs/utils/get-env-path';
import { BikeModule } from './modules/bike/bike.module';
import { BookingModule } from './modules/booking/booking.module';
import paymentGatewayConfig from './libs/payment-gateway/config/payment-gateway.config';
import { PaymentModule } from './modules/payment/payment.module';
import fileConfig from './libs/uploader/config/file.config';
import { FileModule } from './modules/file/file.module';

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
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        mailerConfig,
        paymentGatewayConfig,
        fileConfig,
      ],
      envFilePath: getEnvFilePath(),
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
    AuthModule,
    NotificationModule,
    BikeModule,
    BookingModule,
    PaymentModule,
    FileModule,
  ],
  controllers: [],
  providers: [AppRequestContext, ...filters, ...interceptors],
})
export class AppModule {}
