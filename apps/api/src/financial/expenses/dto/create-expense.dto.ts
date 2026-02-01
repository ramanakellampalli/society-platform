import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsUrl, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMode } from '@repo/database';

export class CreateExpenseDto {
  @IsString()
  societyId: string;

  @IsString()
  categoryId: string;

  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  vendorName?: string;

  @IsString()
  @Length(5, 1000)
  description: string;

  @IsUrl()
  @IsOptional()
  receiptUrl?: string;

  @IsEnum(PaymentMode)
  @IsOptional()
  paymentMode?: PaymentMode;

  @IsString()
  @IsOptional()
  transactionId?: string;
}