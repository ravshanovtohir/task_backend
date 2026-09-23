import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  perPage: number;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((result: unknown) => {
        const response = context.switchToHttp().getResponse<{
          statusCode: number;
        }>();

        if (this.isPaginatedResult(result)) {
          const totalPage = result.totalItems === 0 ? 0 : Math.ceil(result.totalItems / result.perPage);

          return {
            success: true,
            message: '',
            code: response.statusCode,
            data: result.data,
            meta: {
              totalPage,
              totalSize: result.perPage,
              currentPage: result.currentPage,
              hasNextPage: result.currentPage < totalPage,
              hasPreviousPage: result.currentPage > 1 && totalPage > 0,
              totalItems: result.totalItems,
            },
          };
        }

        return {
          success: true,
          message: '',
          code: response.statusCode,
          data: result,
        };
      }),
    );
  }

  private isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const result = value as Partial<PaginatedResult<unknown>>;

    return (
      Array.isArray(result.data) &&
      typeof result.totalItems === 'number' &&
      typeof result.currentPage === 'number' &&
      typeof result.perPage === 'number'
    );
  }
}
