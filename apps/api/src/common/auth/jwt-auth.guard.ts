import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_COOKIES, ERROR_CODES } from '@swiftdrop/contracts';
import type { Request } from 'express';
import { AppError } from '../errors/app-error';
import { IS_PUBLIC_KEY } from './decorators';
import { TokenService } from './token.service';

/**
 * Global guard (registered in app.module). Every route requires a valid access token unless
 * marked @Public(). Token is read from the `sd_access` httpOnly cookie, falling back to an
 * `Authorization: Bearer` header (handy for Swagger and tests).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const token = extractToken(req);
    if (!token) throw unauthenticated('Authentication required');

    try {
      req.user = await this.tokens.verifyAccessToken(token);
    } catch {
      throw unauthenticated('Invalid or expired session');
    }
    // TODO(M2): optionally re-check that the user is still active / role unchanged (cache briefly).
    return true;
  }
}

function extractToken(req: Request): string | undefined {
  const fromCookie = req.cookies?.[AUTH_COOKIES.ACCESS];
  if (typeof fromCookie === 'string' && fromCookie) return fromCookie;
  const [scheme, value] = (req.headers.authorization ?? '').split(' ');
  return scheme === 'Bearer' && value ? value : undefined;
}

const unauthenticated = (message: string) =>
  new AppError(ERROR_CODES.UNAUTHENTICATED, message, HttpStatus.UNAUTHORIZED);
