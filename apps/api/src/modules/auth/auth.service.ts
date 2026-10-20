import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../common/errors/app-error';
import { TokenService } from '../../common/auth';
import { PrismaService } from '../../infra/prisma';
import { UsersService } from '../users';
import type { AuthResponseDto, LoginDto, RegisterDto } from './dto/auth.dto';

export interface SessionMeta {
  userAgent?: string;
  ip?: string;
}

export interface IssuedSession extends AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * Owner: M2. Password auth, refresh-token rotation (RefreshSession, store only a SHA-256 hash),
 * Google OAuth (state + PKCE, verify id_token server-side). See docs/members/M02-auth.md.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly tokens: TokenService,
  ) {}

  async register(_dto: RegisterDto, _meta: SessionMeta): Promise<IssuedSession> {
    notImplemented('M2'); // TODO(M2): role is ALWAYS CUSTOMER here; staff are created by admins
  }

  async login(_dto: LoginDto, _meta: SessionMeta): Promise<IssuedSession> {
    notImplemented('M2'); // TODO(M2): constant-time failure path, INVALID_CREDENTIALS, ACCOUNT_DISABLED
  }

  async refresh(_refreshToken: string | undefined, _meta: SessionMeta): Promise<IssuedSession> {
    notImplemented('M2'); // TODO(M2): rotate; on reuse of a revoked token revoke the whole chain
  }

  async logout(_refreshToken: string | undefined): Promise<void> {
    notImplemented('M2');
  }

  /** Returns the Google consent URL; stores state/PKCE verifier in a short-lived httpOnly cookie. */
  async googleAuthUrl(): Promise<{ url: string; state: string; codeVerifier: string }> {
    notImplemented('M2');
  }

  async googleCallback(
    _code: string,
    _state: string,
    _expectedState: string | undefined,
    _codeVerifier: string | undefined,
    _meta: SessionMeta,
  ): Promise<IssuedSession> {
    notImplemented('M2');
  }
}
