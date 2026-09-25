import { RoleKey } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LocalizedTitleDto {
  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsString({ message: i18nValidationMessage('main.validation.role.titleUzString') })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.role.titleUzRequired') })
  @MinLength(2, { message: i18nValidationMessage('main.validation.role.titleUzLength') })
  @MaxLength(50, { message: i18nValidationMessage('main.validation.role.titleUzLength') })
  uz: string;

  @ApiProperty({ type: String, required: true, example: 'Админ' })
  @IsString({ message: i18nValidationMessage('main.validation.role.titleRuString') })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.role.titleRuRequired') })
  @MinLength(2, { message: i18nValidationMessage('main.validation.role.titleRuLength') })
  @MaxLength(50, { message: i18nValidationMessage('main.validation.role.titleRuLength') })
  ru: string;
}

export class CreateRoleDto {
  @ApiProperty({ type: String, required: true, enum: RoleKey })
  @IsString({ message: i18nValidationMessage('main.validation.role.keyString') })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.role.keyRequired') })
  key: string;

  @ApiProperty({ type: LocalizedTitleDto, required: true, example: LocalizedTitleDto })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.role.titleRequired') })
  @ValidateNested()
  @Type(() => LocalizedTitleDto)
  title: LocalizedTitleDto;
}
