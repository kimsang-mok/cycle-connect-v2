import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from '@src/modules/auth/libs/guard/jwt-auth-guard';
import { MockJwtAuthGuard } from '@tests/mocks/mock-auth.guard';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { Reflector } from '@nestjs/core';
import { ResolvePromisesInterceptor } from '@src/libs/utils/serializer.interceptor';

export interface TestAppContext {
  app: INestApplication;
  module: TestingModule;
  dataSource: DataSource;
}

export async function createTestModule(): Promise<TestAppContext> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockJwtAuthGuard)
    .compile();

  const app = moduleRef.createNestApplication();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get<ConfigService<AllConfigType>>(ConfigService);

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableShutdownHooks();

  await app.init();

  const dataSource = moduleRef.get<DataSource>(getDataSourceToken());

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return { app, module: moduleRef, dataSource };
}
