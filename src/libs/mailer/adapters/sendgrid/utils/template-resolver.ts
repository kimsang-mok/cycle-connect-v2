import { ConfigService } from '@nestjs/config';
import { MailType } from '@src/libs/mailer/mailer.enums';
import { AllConfigType } from '@src/configs/config.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateResolver {
  private templateMap: Record<MailType, string | undefined>;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.templateMap = {
      VERIFY_EMAIL: configService.getOrThrow('mailer.verifyTemplatePath', {
        infer: true,
      }),
      FORGOT_PASSWORD_EMAIL: configService.getOrThrow(
        'mailer.forgotPasswordTemplatePath',
        {
          infer: true,
        },
      ),
      TWO_FACTOR_EMAIL: configService.getOrThrow(
        'mailer.twoFactorTemplatePath',
        {
          infer: true,
        },
      ),
    };
  }

  getTemplateId(mailType: MailType): string {
    return this.templateMap[mailType] || 'default';
  }
}
