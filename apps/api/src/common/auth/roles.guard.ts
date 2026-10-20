import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@swiftdrop/contracts';
import type { Request } from 'express';
import { forbidden } from '../errors/app-error';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators';

/**
 * Global guard: enforces @Roles(). This is ROLE-level only — object-level checks
 * ("is this MY parcel?") MUST still be done in services/queries. See docs/conventions/security.md.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const targets = [ctx.getHandler(), ctx.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets);
    if (!roles?.length) return true;

    const user = ctx.switchToHttp().getRequest<Request>().user;
    if (!user || !roles.includes(user.role)) throw forbidden();
    return true;
  }
}
