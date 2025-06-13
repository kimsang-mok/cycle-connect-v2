import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
import { AppRequestContext } from './app-request-context';
import { runWithContext } from '../utils/run-with-context';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly appContext: AppRequestContext) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * setting an ID in the global context for each request.
     * this ID can be used as correlation id shown in logs
     */
    const requestId = this.extractRequestId(context) ?? nanoid(6);

    this.setRequestId(context, requestId);

    return runWithContext(this.appContext, requestId, () => next.handle());
  }

  private extractRequestId(context: ExecutionContext): string | undefined {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request?.headers['x-request-id'] || request?.body?.requestId;
    }

    return undefined;
  }

  // set requestId on the request object for access in filters
  private setRequestId(context: ExecutionContext, requestId: string) {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      request.__requestId = requestId;
      return request;
    }
  }
}
