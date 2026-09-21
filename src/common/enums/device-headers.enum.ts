import { IsEnum, IsOptional } from 'class-validator';
import type { ParameterObject } from '@nestjs/swagger';

enum Lang {
  ru = 'ru',
  en = 'en',
}

export class DeviceHeadersDto {
  @IsOptional()
  @IsEnum(Lang)
  lang?: Lang;
}

export const globalHeaderParametrs: ParameterObject[] = [
  {
    in: 'header',
    name: 'lang',
    required: false,
    schema: {
      enum: ['ru', 'en'],
      type: 'string',
      default: 'ru',
    },
  },
];
