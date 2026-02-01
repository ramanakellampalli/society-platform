import { IsString, IsInt, IsNumber, IsBoolean, IsOptional, IsEmail, Min, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlatDto {
  @IsString()
  societyId: string;

  @IsString()
  @Length(1, 50)
  flatNumber: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  block?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  floor?: number;

  @IsInt()
  @IsOptional()
  @Min(100)
  @Type(() => Number)
  sqFeet?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maintenanceAmount?: number;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  ownerName?: string;

  @IsString()
  @IsOptional()
  @Length(10, 10)
  @Matches(/^[0-9]{10}$/)
  ownerPhone?: string;

  @IsEmail()
  @IsOptional()
  ownerEmail?: string;

  @IsBoolean()
  @IsOptional()
  isRented?: boolean;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  tenantName?: string;

  @IsString()
  @IsOptional()
  @Length(10, 10)
  @Matches(/^[0-9]{10}$/)
  tenantPhone?: string;
}