import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ApiErrorResponse } from '@src/libs/api';
import { Response } from 'express';
import { DomainErrorBase } from '@src/libs/exceptions';
import { getCorrelationIdFromHost } from '../utils/get-correlation-id';

@Catch(DomainErrorBase)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainErrorBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = getCorrelationIdFromHost(host);

    const status = exception.getStatus();

    this.logger.debug(`[${correlationId}] Domain error: ${exception.message}`);

    const errorResponse = new ApiErrorResponse({
      statusCode: status,
      message: exception.message,
      error: exception.code,
      correlationId,
    });

    response.status(status).json(errorResponse);
  }
}
