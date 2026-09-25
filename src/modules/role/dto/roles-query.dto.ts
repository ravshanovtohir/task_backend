import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@helpers';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RoleListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.staff.searchString') })
  search?: string;

  @ApiProperty({ type: String, required: false, example: 'ADMIN' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.role.keyString') })
  key?: string;
}
