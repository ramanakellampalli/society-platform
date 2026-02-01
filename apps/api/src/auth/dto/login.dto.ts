import { IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(10, 10)
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone: string;

  @IsString()
  @Length(6, 100)
  password: string;
}