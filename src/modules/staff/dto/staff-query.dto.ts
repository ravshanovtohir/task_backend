import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '@helpers';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class StaffListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.staff.searchString') })
  search?: string;

  @ApiProperty({ type: Number, required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('main.validation.common.invalidId') })
  @Min(1, { message: i18nValidationMessage('main.validation.common.invalidId') })
  id?: number;

  @ApiProperty({ type: String, required: false, example: 'admin@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('main.validation.staff.emailInvalid') })
  email?: string;
}
