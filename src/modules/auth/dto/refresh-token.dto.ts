import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto {
  @ApiProperty({ type: String, required: true, example: 'refresh-token-value' })
  @IsString({ message: i18nValidationMessage('main.validation.auth.refreshTokenString') })
  @IsNotEmpty({ message: i18nValidationMessage('main.validation.auth.refreshTokenRequired') })
  refresh_token: string;
}
