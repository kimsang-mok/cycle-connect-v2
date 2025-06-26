import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FileUploaderServicePort } from '../../ports/file-uploader.service.port';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import {
  PresignedRequestProps,
  PresignedUrlResult,
} from '@src/modules/file/domain/file-uploader.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3FileUploaderService implements FileUploaderServicePort {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  private readonly client = new S3Client({
    region: this.configService.getOrThrow('file.awsS3Region', { infer: true }),
    credentials: {
      accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
        infer: true,
      }),
      secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
        infer: true,
      }),
    },
  });

  private readonly bucket = this.configService.getOrThrow(
    'file.awsDefaultS3Bucket',
    { infer: true },
  );

  async generatePresignedUrl(
    key: string,
    request: PresignedRequestProps,
  ): Promise<PresignedUrlResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: request.mimetype,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 300 });

    return { key, url };
  }
}
