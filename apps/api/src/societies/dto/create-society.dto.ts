import { IsString, IsInt, IsNumber, IsEnum, IsOptional, Min, Length } from 'class-validator';
import { BillingCycle } from '@repo/database';
import { Type } from 'class-transformer';

export class CreateSocietyDto {
  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @Length(5, 500)
  address: string;

  @IsString()
  @Length(2, 100)
  city: string;

  @IsString()
  @Length(2, 100)
  state: string;

  @IsString()
  @Length(6, 6)
  pincode: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalFlats: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  maintenanceAmount: number;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;
}