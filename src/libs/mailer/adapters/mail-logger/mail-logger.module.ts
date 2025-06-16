import { Module } from '@nestjs/common';
import { MailLoggerService } from './mail-logger.service';

@Module({
  providers: [MailLoggerService],
  exports: [MailLoggerService],
})
export class MailLoggerModule {}
