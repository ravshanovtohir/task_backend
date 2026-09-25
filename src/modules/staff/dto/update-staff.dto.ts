import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEmail, IsInt, IsOptional, IsString, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateStaffDto {
  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Madina' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.staff.firstNameString') })
  @Length(2, 50, { message: i18nValidationMessage('main.validation.staff.firstNameLength') })
  @Matches(/^\p{L}[\p{L}\p{M}'ʻʼ’‘ -]*$/u, { message: i18nValidationMessage('main.validation.staff.firstNameLetters') })
  firstName: string;

  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Nimadirova' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.staff.lastNameString') })
  @Length(2, 50, { message: i18nValidationMessage('main.validation.staff.lastNameLength') })
  @Matches(/^\p{L}[\p{L}\p{M}'ʻʼ’‘ -]*$/u, { message: i18nValidationMessage('main.validation.staff.lastNameLetters') })
  lastName: string;

  @ApiProperty({ type: String, required: true, example: 'example@gamil.com' })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('main.validation.staff.emailInvalid') })
  email: string;

  @ApiProperty({ type: String, required: true, minLength: 8, maxLength: 30, example: 'nimadirda' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('main.validation.staff.passwordString') })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,30}$/, {
    message: i18nValidationMessage('main.validation.staff.passwordPattern'),
  })
  password: string;

  @ApiPropertyOptional({
    type: [Number],
    example: [2, 3],
  })
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('main.validation.staff.rolesArray') })
  @ArrayUnique({ message: i18nValidationMessage('main.validation.staff.rolesUnique') })
  @Type(() => Number)
  @IsInt({ each: true, message: i18nValidationMessage('main.validation.staff.roleIdInteger') })
  roleIds?: number[];
}
