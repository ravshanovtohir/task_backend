import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationQueryDto {
  @ApiProperty({ type: Number, required: false, default: 1, description: 'Page' })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('main.validation.pagination.pageInteger') })
  @Min(1, { message: i18nValidationMessage('main.validation.pagination.pageMinimum') })
  page = 1;

  @ApiProperty({ type: Number, required: false, default: 20, description: 'Size' })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('main.validation.pagination.perPageInteger') })
  @Min(1, { message: i18nValidationMessage('main.validation.pagination.perPageMinimum') })
  @Max(100, { message: i18nValidationMessage('main.validation.pagination.perPageMaximum') })
  perPage = 20;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  perPage: number;
}

export async function paginate<T>(params: {
  page: number;
  perPage: number;
  count: () => Promise<number>;
  findMany: (skip: number, take: number) => Promise<T[]>;
}): Promise<PaginatedResult<T>> {
  const skip = (params.page - 1) * params.perPage;

  const [totalItems, data] = await Promise.all([params.count(), params.findMany(skip, params.perPage)]);

  return {
    data,
    totalItems,
    currentPage: params.page,
    perPage: params.perPage,
  };
}
