import { IsEnum, IsOptional } from 'class-validator';
import type { ParameterObject } from '@nestjs/swagger';

enum Lang {
  uz = 'uz',
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
    name: 'Accept-Language',
    required: false,
    schema: {
      enum: ['uz', 'ru'],
      type: 'string',
      default: 'ru',
    },
  },
];
