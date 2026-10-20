import type { AuthUser } from '../auth/auth-user';

declare global {
  namespace Express {
    interface Request {
      /** Set by JwtAuthGuard for authenticated routes. */
      user?: AuthUser;
      /** Set by the merchant ApiKeyGuard (M5) on partner API routes. */
      merchantId?: string;
      /** Correlation id set by requestContextMiddleware. */
      id?: string;
    }
  }
}

export {};
