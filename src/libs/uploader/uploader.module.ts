import { DynamicModule, Module } from '@nestjs/common';
import { S3FileUploaderModule } from './adapters/s3/s3-file-uploader.module';
import { FILE_UPLOADER, FILE_URL_RESOLVER } from './uploader.di-tokens';
import { ConfigService } from '@nestjs/config';
import { S3FileUploaderService } from './adapters/s3/s3-file-uploader.service';
import { AllConfigType } from '@src/configs/config.type';
import { FileDriver } from './config/file-config.type';
import { S3FileUrlResolverService } from './adapters/s3/s3-file-url-resolver.service';

@Module({})
export class UploaderModule {
  static register(): DynamicModule {
    return {
      module: UploaderModule,
      imports: [S3FileUploaderModule],
      providers: [
        {
          provide: FILE_UPLOADER,
          inject: [ConfigService, S3FileUploaderService],
          useFactory: (
            configService: ConfigService<AllConfigType>,
            s3Service: S3FileUploaderService,
          ) => {
            const driver = configService.get('file.driver', { infer: true });
            switch (driver) {
              case FileDriver.S3_PRESIGNED:
                return s3Service;
              default:
                throw new Error(`Unsupported file driver: ${driver}`);
            }
          },
        },
        {
          provide: FILE_URL_RESOLVER,
          inject: [ConfigService, S3FileUrlResolverService],
          useFactory: (
            configService: ConfigService<AllConfigType>,
            s3fileUrlResolver: S3FileUrlResolverService,
          ) => {
            const driver = configService.get('file.driver', {
              infer: true,
            });
            switch (driver) {
              case FileDriver.S3_PRESIGNED:
                return s3fileUrlResolver;
              default:
                throw new Error(`Unsupported file driver: ${driver}`);
            }
          },
        },
      ],
      exports: [FILE_UPLOADER, FILE_URL_RESOLVER],
    };
  }
}
