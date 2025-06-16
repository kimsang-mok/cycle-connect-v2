import { DynamicModule, Module } from '@nestjs/common';
import { MAILER } from './mailer.di-tokens';
import { SendgridModule } from './adapters/sendgrid/sendgrid.module';
import { SendgridService } from './adapters/sendgrid/sendgrid.service';
import { ConfigService } from '@nestjs/config';
import { MailLoggerModule } from './adapters/mail-logger/mail-logger.module';
import { AllConfigType } from '@src/configs/config.type';
import { MailLoggerService } from './adapters/mail-logger/mail-logger.service';

@Module({})
export class MailerModule {
  static register(): DynamicModule {
    return {
      module: MailerModule,
      imports: [SendgridModule, MailLoggerModule],
      providers: [
        {
          provide: MAILER,
          inject: [ConfigService, SendgridService, MailLoggerService],
          useFactory: (
            configService: ConfigService<AllConfigType>,
            sendgrid: SendgridService,
            logger: MailLoggerService,
          ) => {
            const mailProvider = configService.get('mailer.transporterType', {
              infer: true,
            });

            switch (mailProvider) {
              case 'sendgrid':
                return sendgrid;
              case 'logger':
              default:
                return logger;
            }
          },
        },
      ],
      exports: [MAILER],
    };
  }
}
