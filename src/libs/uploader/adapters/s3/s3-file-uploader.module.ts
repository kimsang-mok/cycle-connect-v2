import { Module } from '@nestjs/common';
import { S3FileUploaderService } from './s3-file-uploader.service';
import { S3FileUrlResolverService } from './s3-file-url-resolver.service';

@Module({
  providers: [S3FileUploaderService, S3FileUrlResolverService],
  exports: [S3FileUploaderService, S3FileUrlResolverService],
})
export class S3FileUploaderModule {}
