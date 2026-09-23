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
  @IsNotEmpty()
  @IsString()
  @Length(2, 50, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  firstName: string;

  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Nimadirova' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({ type: String, required: true, example: 'example@gamil.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true, minLength: 8, maxLength: 30, example: 'nimadirda' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,30}$/)
  password: string;

  @ApiProperty({
    type: [Number],
    example: [2, 3],
    description: 'Staff uchun biriktiriladigan role IDlari',
  })
  @IsArray()
  @ArrayNotEmpty({
    message: 'Kamida bitta role biriktirilishi shart',
  })
  @ArrayUnique({
    message: 'Bir xil role ikki marta yuborilmasligi kerak',
  })
  @Type(() => Number)
  @IsInt({ each: true })
  roleIds: number[];
}
