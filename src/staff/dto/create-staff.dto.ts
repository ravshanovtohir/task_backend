import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

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
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])\S{1,8}$/)
  password: string;
}
