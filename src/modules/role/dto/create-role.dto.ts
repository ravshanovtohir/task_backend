import { RoleKey } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class LocalizedTitleDto {
  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsString({ message: "O'zbekcha nom string bo'lishi kerak" })
  @IsNotEmpty({ message: "O'zbekcha nom kiritilishi shart" })
  @MinLength(2, { message: "O'zbekcha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "O'zbekcha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  uz: string;

  @ApiProperty({ type: String, required: true, example: 'Админ' })
  @IsString({ message: "Ruscha nom string bo'lishi kerak" })
  @IsNotEmpty({ message: 'Ruscha nom kiritilishi shart' })
  @MinLength(2, { message: "Ruscha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "Ruscha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  ru: string;

  @ApiProperty({ type: String, required: true, example: 'Admin' })
  @IsString({ message: "Inglizcha nom string bo'lishi kerak" })
  @IsNotEmpty({ message: 'Inglizcha nom kiritilishi shart' })
  @MinLength(2, { message: "Inglizcha nom kamida 2 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: "Inglizcha nom ko'pi bilan 50 ta belgidan oshmasligi kerak" })
  en: string;
}

export class CreateRoleDto {
  @ApiProperty({ type: String, required: true, enum: RoleKey })
  @IsString()
  @IsNotEmpty({ message: 'Rol kaliti (key) kiritilishi shart' })
  key: string;

  @ApiProperty({ type: LocalizedTitleDto, required: true, example: LocalizedTitleDto })
  @IsNotEmpty({ message: 'Rol nomlari kiritilishi shart' })
  @ValidateNested()
  @Type(() => LocalizedTitleDto)
  title: LocalizedTitleDto;
}
