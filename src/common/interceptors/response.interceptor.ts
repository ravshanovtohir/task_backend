import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';

export interface PaginatedResult<T> {
  data: T;
  totalItems: number;
  currentPage: number;
  perPage: number;
}

export class PaginationResponse<T> {
  @ApiProperty({ type: Number })
  totalPage: number;

  @ApiProperty({ type: Number })
  currentPage: number;

  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;

  @ApiProperty({ type: Boolean })
  hasPreviousPage: boolean;

  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ description: 'Current page items' })
  data: T;

  constructor(data: T, totalItems: number, currentPage: number, perPage: number) {
    this.totalItems = Math.max(0, totalItems);
    this.totalPage = this.totalItems === 0 ? 0 : Math.ceil(this.totalItems / perPage);
    this.currentPage = Math.max(1, currentPage);
    this.hasNextPage = this.currentPage < this.totalPage;
    this.hasPreviousPage = this.currentPage > 1 && this.totalPage > 0;
    this.data = data;
  }
}

export class CustomResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty({ type: Number, example: 200 })
  code: number;

  @ApiProperty({ description: 'Response payload' })
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CustomResponse<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<{ statusCode: number }>();

        return {
          success: true,
          message: '',
          code: response.statusCode,
          data: isPaginatedResult(data)
            ? new PaginationResponse(data.data, data.totalItems, data.currentPage, data.perPage)
            : data,
        };
      }),
    );
  }
}

function isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as Partial<PaginatedResult<unknown>>;

  return (
    'data' in result &&
    typeof result.totalItems === 'number' &&
    Number.isInteger(result.totalItems) &&
    result.totalItems >= 0 &&
    typeof result.currentPage === 'number' &&
    Number.isInteger(result.currentPage) &&
    result.currentPage >= 1 &&
    typeof result.perPage === 'number' &&
    Number.isInteger(result.perPage) &&
    result.perPage > 0
  );
}
