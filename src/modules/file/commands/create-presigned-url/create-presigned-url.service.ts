import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePresignedUrlCommand } from './create-presigned-url.command';
import { Inject } from '@nestjs/common';
import { FILE_UPLOADER } from '@src/libs/uploader/uploader.di-tokens';
import { FileUploaderServicePort } from '@src/libs/uploader/ports/file-uploader.service.port';
import { PresignedUrlResponseDto } from '../../dtos/presigned-url.response.dto';
import { PresignedRequest } from '../../domain/value-objects/presigned-request.value-object';

@CommandHandler(CreatePresignedUrlCommand)
export class CreatePresignedUrlService
  implements ICommandHandler<CreatePresignedUrlCommand, PresignedUrlResponseDto>
{
  constructor(
    @Inject(FILE_UPLOADER) private readonly uploader: FileUploaderServicePort,
  ) {}

  execute(
    command: CreatePresignedUrlCommand,
  ): Promise<PresignedUrlResponseDto> {
    const presignedRequest = new PresignedRequest(command);

    return this.uploader.generatePresignedUrl(
      presignedRequest.getKey(),
      presignedRequest.unpack(),
    );
  }
}
