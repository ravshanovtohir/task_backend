import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@helpers';
import { ApiProperty } from '@nestjs/swagger';

export class RoleListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ type: String, required: false, example: 'ADMIN' })
  @IsOptional()
  @IsString()
  key?: string;
}
