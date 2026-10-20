import type { Role } from '@swiftdrop/contracts';

/** What guards attach to `req.user` for JWT-authenticated requests. */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

/** Claims inside the access JWT. Keep minimal — no PII beyond email. */
export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: Role;
}
