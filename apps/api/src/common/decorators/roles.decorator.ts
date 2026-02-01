import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@repo/database';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);