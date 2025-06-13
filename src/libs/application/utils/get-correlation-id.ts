import { ArgumentsHost } from '@nestjs/common';
import { Request } from 'express';

export function getCorrelationIdFromHost(host: ArgumentsHost): string {
  const request = host
    .switchToHttp()
    .getRequest<Request & { __requestId?: string }>();
  return request?.__requestId ?? 'unknown';
}
