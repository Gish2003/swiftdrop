import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_COOKIES } from '@swiftdrop/contracts';
import type { CookieOptions, Response } from 'express';
import { InjectConfig, type Env } from '../../config/config.module';
import type { AccessTokenClaims, AuthUser } from './auth-user';

/**
 * Access-token signing/verification + auth cookie helpers. Shared foundation used by the
 * global JwtAuthGuard, the dev login and the auth module (M2). Owner: M2 (from Week 1 handover).
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    @InjectConfig() private readonly config: Env,
  ) {}

  signAccessToken(user: AuthUser): Promise<string> {
    const claims: AccessTokenClaims = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.signAsync(claims, {
      secret: this.config.JWT_ACCESS_SECRET,
      expiresIn: this.config.JWT_ACCESS_TTL_SECONDS,
      issuer: this.config.JWT_ISSUER,
      audience: this.config.JWT_AUDIENCE,
    });
  }

  async verifyAccessToken(token: string): Promise<AuthUser> {
    const claims = await this.jwt.verifyAsync<AccessTokenClaims>(token, {
      secret: this.config.JWT_ACCESS_SECRET,
      issuer: this.config.JWT_ISSUER,
      audience: this.config.JWT_AUDIENCE,
      algorithms: ['HS256'],
    });
    return { id: claims.sub, email: claims.email, role: claims.role };
  }

  cookieOptions(maxAgeMs: number, path = '/'): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.COOKIE_SECURE,
      sameSite: 'lax',
      path,
      maxAge: maxAgeMs,
    };
  }

  setAccessCookie(res: Response, token: string) {
    res.cookie(
      AUTH_COOKIES.ACCESS,
      token,
      this.cookieOptions(this.config.JWT_ACCESS_TTL_SECONDS * 1000),
    );
  }

  setRefreshCookie(res: Response, token: string) {
    res.cookie(
      AUTH_COOKIES.REFRESH,
      token,
      // scoped to the auth routes so it is not sent on every API call
      this.cookieOptions(this.config.JWT_REFRESH_TTL_DAYS * 86_400_000, '/api/v1/auth'),
    );
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(AUTH_COOKIES.ACCESS, { path: '/' });
    res.clearCookie(AUTH_COOKIES.REFRESH, { path: '/api/v1/auth' });
  }
}
