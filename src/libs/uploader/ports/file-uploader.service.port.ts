import {
  PresignedRequestProps,
  PresignedUrlResult,
} from '@src/modules/file/domain/file-uploader.types';

export interface FileUploaderServicePort {
  generatePresignedUrl(
    key: string,
    request: PresignedRequestProps,
  ): Promise<PresignedUrlResult>;
}
