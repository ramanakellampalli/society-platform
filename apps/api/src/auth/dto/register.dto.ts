import { IsString, IsEmail, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { UserRole } from '@repo/database';

export class RegisterDto {
  @IsString()
  @Length(10, 10, { message: 'Phone must be exactly 10 digits' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone must contain only digits' })
  phone: string;

  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  societyId: string;

  @IsString()
  @IsOptional()
  flatId?: string;
}