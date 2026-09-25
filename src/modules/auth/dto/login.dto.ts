import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginRequestDto {
  @ApiProperty({ type: String, required: true, description: 'login', example: 'test@example.com' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.auth.loginRequired') })
  @IsString({ message: i18nValidationMessage('main.validation.auth.loginString') })
  login: string;

  @ApiProperty({ type: String, required: true, description: 'password', example: 'password123' })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.auth.passwordRequired') })
  @IsString({ message: i18nValidationMessage('main.validation.auth.passwordString') })
  password: string;
}
