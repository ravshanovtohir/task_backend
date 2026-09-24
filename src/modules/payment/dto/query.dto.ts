import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PaginationQueryDto } from '@helpers';

export class TransactionListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'TXN-000001',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('main.validation.payment.referenceString'),
  })
  search?: string;

  @ApiPropertyOptional({
    enum: TransactionStatus,
  })
  @IsOptional()
  @IsEnum(TransactionStatus, {
    message: i18nValidationMessage('main.validation.payment.statusInvalid'),
  })
  status?: TransactionStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('main.validation.payment.dateInvalid'),
    },
  )
  from?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('main.validation.payment.dateInvalid'),
    },
  )
  to?: string;

  @ApiPropertyOptional({
    example: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('main.validation.payment.amountNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('main.validation.payment.amountMinimum'),
  })
  minAmount?: number;

  @ApiPropertyOptional({
    example: 5000000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('main.validation.payment.amountNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('main.validation.payment.amountMinimum'),
  })
  maxAmount?: number;
}
