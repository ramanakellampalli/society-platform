import type { User } from '@repo/database';

export function userToDto(user: User) {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email ?? undefined,
    role: user.role,
    societyId: user.societyId,
    flatId: user.flatId ?? undefined,
  };
}