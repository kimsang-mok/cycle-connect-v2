import { FileUrlResolverServicePort } from '../../ports/file-url-resolver.service.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';

@Injectable()
export class S3FileUrlResolverService implements FileUrlResolverServicePort {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  resolveUrl(key: string): string {
    if (key) {
      return `https://${this.configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true })}.s3.${this.configService.getOrThrow('file.awsS3Region', { infer: true })}.amazonaws.com/${key}`;
    }
    return '';
  }
}
