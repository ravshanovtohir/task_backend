import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

class LocalizedTitleDto {
  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.role.titleUzString') })
  @MinLength(2, { message: i18nValidationMessage('main.validation.role.titleUzLength') })
  @MaxLength(50, { message: i18nValidationMessage('main.validation.role.titleUzLength') })
  uz: string;

  @ApiProperty({ type: String, required: true, example: 'Админ' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.role.titleRuString') })
  @MinLength(2, { message: i18nValidationMessage('main.validation.role.titleRuLength') })
  @MaxLength(50, { message: i18nValidationMessage('main.validation.role.titleRuLength') })
  ru: string;
}

export class UpdateRoleDto {
  @ApiProperty({ type: LocalizedTitleDto, required: true, example: LocalizedTitleDto })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.role.titleRequired') })
  @ValidateNested()
  @Type(() => LocalizedTitleDto)
  title: LocalizedTitleDto;
}
