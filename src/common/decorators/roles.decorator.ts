import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles' as const;

export enum RoleKey {
  ADMIN = 'ADMIN',
  PAYMENT = 'PAYMENT',
  REPORTS = 'REPORTS',
}

export const Roles = (...roles: RoleKey[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
