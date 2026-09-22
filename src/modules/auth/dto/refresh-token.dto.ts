import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ type: String, required: true, example: 'refresh-token-value' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
