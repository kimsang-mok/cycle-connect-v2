import { Module, Provider } from '@nestjs/common';
import { CreatePresignedUrlController } from './commands/create-presigned-url/create-presigned-url.controller';
import { CreatePresignedUrlService } from './commands/create-presigned-url/create-presigned-url.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UploaderModule } from '@src/libs/uploader/uploader.module';

const controllers = [CreatePresignedUrlController];

const commandHandlers: Provider[] = [CreatePresignedUrlService];

@Module({
  imports: [CqrsModule, UploaderModule.register()],
  controllers: [...controllers],
  providers: [...commandHandlers],
})
export class FileModule {}
