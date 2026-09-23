import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ type: Number, required: false, default: 1, description: 'Page' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ type: Number, required: false, default: 20, description: 'Size' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
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
