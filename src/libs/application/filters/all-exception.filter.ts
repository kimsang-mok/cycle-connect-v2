import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiErrorResponse } from '@src/libs/api';
import { Response } from 'express';
import { getCorrelationIdFromHost } from '../utils/get-correlation-id';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = getCorrelationIdFromHost(host);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    this.logger.debug(`[${correlationId}] Unexpected exception: ${message}`);

    if (exception instanceof Error && !(exception instanceof HttpException)) {
      this.logger.debug(
        `[${correlationId}] Stack traces: ${(exception as Error).stack}`,
      );
    }

    const errorResponse = new ApiErrorResponse({
      statusCode: status,
      message,
      error: 'UNEXPECTED_ERROR',
      correlationId,
    });

    response.status(status).json(errorResponse);
  }
}
