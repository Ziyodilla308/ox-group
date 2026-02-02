import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';

import { ROLES_KEY } from '../../common/constants/constant';
import { Role } from '@prisma/client';

export function Roles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}

export const AdminOnly = () => Roles(Role.ADMIN);
export const ManagerOnly = () => Roles(Role.MANAGER, Role.ADMIN);
