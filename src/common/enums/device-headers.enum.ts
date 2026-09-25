import { IsEnum, IsOptional } from 'class-validator';
import type { ParameterObject } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

enum Lang {
  uz = 'uz',
  ru = 'ru',
}

export class DeviceHeadersDto {
  @IsOptional()
  @IsEnum(Lang, { message: i18nValidationMessage('main.validation.language.invalid') })
  lang?: Lang;
}

export const globalHeaderParametrs: ParameterObject[] = [
  {
    in: 'header',
    name: 'Accept-Language',
    required: false,
    schema: {
      enum: ['uz', 'ru'],
      type: 'string',
      default: 'uz',
    },
  },
];
