import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStaffDto {
  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Madina' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.staff.firstNameRequired') })
  @IsString({ message: i18nValidationMessage('main.validation.staff.firstNameString') })
  @Length(2, 50, { message: i18nValidationMessage('main.validation.staff.firstNameLength') })
  @Matches(/^\p{L}[\p{L}\p{M}'ʻʼ’‘ -]*$/u, { message: i18nValidationMessage('main.validation.staff.firstNameLetters') })
  firstName: string;

  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Nimadirova' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.staff.lastNameRequired') })
  @IsString({ message: i18nValidationMessage('main.validation.staff.lastNameString') })
  @Length(2, 50, { message: i18nValidationMessage('main.validation.staff.lastNameLength') })
  @Matches(/^\p{L}[\p{L}\p{M}'ʻʼ’‘ -]*$/u, { message: i18nValidationMessage('main.validation.staff.lastNameLetters') })
  lastName: string;

  @ApiProperty({ type: String, required: true, example: 'example@gamil.com' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.staff.emailRequired') })
  @IsEmail({}, { message: i18nValidationMessage('main.validation.staff.emailInvalid') })
  email: string;

  @ApiProperty({ type: String, required: true, minLength: 8, maxLength: 30, example: 'nimadirda' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.staff.passwordRequired') })
  @IsString({ message: i18nValidationMessage('main.validation.staff.passwordString') })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,30}$/, {
    message: i18nValidationMessage('main.validation.staff.passwordPattern'),
  })
  password: string;

  @ApiProperty({
    type: [Number],
    example: [2, 3],
    description: 'Staff uchun biriktiriladigan role IDlari',
  })
  @IsArray({ message: i18nValidationMessage('main.validation.staff.rolesArray') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('main.validation.staff.rolesRequired'),
  })
  @ArrayUnique({
    message: i18nValidationMessage('main.validation.staff.rolesUnique'),
  })
  @Type(() => Number)
  @IsInt({ each: true, message: i18nValidationMessage('main.validation.staff.roleIdInteger') })
  roleIds: number[];
}
