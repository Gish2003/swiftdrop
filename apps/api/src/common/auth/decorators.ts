import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import type { Role } from '@swiftdrop/contracts';
import type { AuthUser } from './auth-user';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/** Skip JWT auth (public endpoints, or endpoints protected by another guard e.g. merchant API keys). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Restrict an endpoint/controller to roles. No @Roles = any authenticated user. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/** Inject the authenticated user: `me(@CurrentUser() user: AuthUser)` */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined =>
    ctx.switchToHttp().getRequest().user,
);
