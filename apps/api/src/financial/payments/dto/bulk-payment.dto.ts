import { IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class FlatPaymentDto {
  flatId: string;
  amount: number;
}

export class BulkPaymentDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlatPaymentDto)
  payments: FlatPaymentDto[];
}