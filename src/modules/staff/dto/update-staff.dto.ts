import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Madina' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({ type: String, required: true, minLength: 2, maxLength: 50, example: 'Nimadirova' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({ type: String, required: true, example: 'example@gamil.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true, minLength: 8, maxLength: 30, example: 'nimadirda' })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])\S{1,8}$/)
  password: string;
}
