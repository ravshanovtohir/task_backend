import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeviceHeadersDto } from '@enums';

export const HeadersValidation = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const acceptLanguage = request.headers['accept-language'];

  const rawLanguage = Array.isArray(acceptLanguage) ? acceptLanguage[0] : acceptLanguage;

  const lang = rawLanguage?.split(',')[0]?.trim()?.split('-')[0]?.toLowerCase();

  const headersDto = plainToInstance(DeviceHeadersDto, { lang });

  const errors = await validate(headersDto);

  if (errors.length > 0) {
    throw new BadRequestException('main.validation.language.invalid');
  }

  return headersDto.lang ?? 'uz';
});
