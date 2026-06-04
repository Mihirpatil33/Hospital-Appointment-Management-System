import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

// Usage on controller methods: @Roles(Role.DOCTOR)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
