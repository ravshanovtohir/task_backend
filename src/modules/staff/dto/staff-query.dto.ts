import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@helpers';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StaffListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ type: Number, required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiProperty({ type: String, required: false, example: 'admin@gmail.com' })
  @IsOptional()
  @IsNumber()
  email?: string;
}
