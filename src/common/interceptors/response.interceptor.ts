import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';

import { RESPONSE_MESSAGE_KEY } from '@decorators';

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
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ description: 'Response payload' })
  result: T;

  @ApiPropertyOptional({ type: String })
  error?: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<CustomResponse<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<{ statusCode: number }>();
        const message =
          this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [context.getHandler(), context.getClass()]) ??
          'Success';

        return {
          statusCode: response.statusCode,
          message,
          result: isPaginatedResult(data)
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
    Number.isFinite(result.totalItems) &&
    typeof result.currentPage === 'number' &&
    Number.isInteger(result.currentPage) &&
    typeof result.perPage === 'number' &&
    Number.isInteger(result.perPage) &&
    result.perPage > 0
  );
}
