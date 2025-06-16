import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/configs/config.type';
import { SendgridService } from './sendgrid.service';
import { TemplateResolver } from './utils/template-resolver';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        baseURL: configService.get('mailer.host', { infer: true }),
        headers: {
          Authorization: `Bearer ${configService.getOrThrow('mailer.password', { infer: true })}`,
        },
      }),
    }),
  ],
  providers: [SendgridService, TemplateResolver],
  exports: [SendgridService],
})
export class SendgridModule {}
