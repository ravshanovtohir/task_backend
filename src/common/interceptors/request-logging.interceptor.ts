import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; originalUrl?: string; url: string }>();
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();
    const startedAt = process.hrtime.bigint();

    const log = (statusCode: number) => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      this.logger.log(
        `${request.method} ${request.originalUrl ?? request.url} ${statusCode} ${durationMs.toFixed(1)}ms`,
      );
    };

    return next.handle().pipe(
      tap({
        next: () => log(response.statusCode),
        error: (error: unknown) => {
          const statusCode =
            typeof error === 'object' && error !== null && 'getStatus' in error && typeof error.getStatus === 'function'
              ? error.getStatus()
              : 500;
          log(statusCode);
        },
      }),
    );
  }
}
