import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ type: String, required: true, description: 'login', example: 'test@example.com' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ type: String, required: true, description: 'password', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
