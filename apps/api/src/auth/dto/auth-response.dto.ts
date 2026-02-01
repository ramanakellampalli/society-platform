import { UserRole } from '@repo/database';

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    email?: string;
    role: UserRole;
    societyId: string;
    flatId?: string;
  };
}