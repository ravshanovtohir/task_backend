import { RoleKey } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

class LocalizedTitleDto {
  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsOptional({ message: "O'zbekcha nom kiritilishi shart" })
  @IsString({ message: "O'zbekcha nom string bo'lishi kerak" })
  @MinLength(2, { message: "O'zbekcha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "O'zbekcha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  uz: string;

  @ApiProperty({ type: String, required: true, example: 'Админ' })
  @IsOptional({ message: 'Ruscha nom kiritilishi shart' })
  @IsString({ message: "Ruscha nom string bo'lishi kerak" })
  @MinLength(2, { message: "Ruscha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "Ruscha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  ru: string;

  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsOptional({ message: 'Inglizcha nom kiritilishi shart' })
  @IsString({ message: "Inglizcha nom string bo'lishi kerak" })
  @MinLength(2, { message: "Inglizcha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "Inglizcha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  en: string;
}

export class UpdateRoleDto {
  @ApiProperty({ type: LocalizedTitleDto, required: true, example: LocalizedTitleDto })
  @IsNotEmpty({ message: 'Rol nomlari kiritilishi shart' })
  @ValidateNested()
  @Type(() => LocalizedTitleDto)
  title: LocalizedTitleDto;
}
