import { IsString, IsInt, IsNumber, IsDateString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMode, PaymentStatus } from '@repo/database';

export class CreatePaymentDto {
  @IsString()
  flatId: string;

  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;

  @IsInt()
  @Min(2020)
  @Max(2100)
  @Type(() => Number)
  year: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsEnum(PaymentMode)
  @IsOptional()
  paymentMode?: PaymentMode;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}