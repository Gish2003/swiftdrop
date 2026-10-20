# ADR-0003: JWT in httpOnly cookies

**Status:** accepted · **Owner:** M2

## Decision

- The access JWT (HS256, 15 min, with issuer and audience) goes in the `sd_access` cookie.
- The refresh token is random, its hash is stored in `refresh_sessions`, and it rotates on every use.
  It goes in the `sd_refresh` cookie, scoped to the path `/api/v1/auth`.
- Both cookies are `httpOnly` and `SameSite=Lax`, and `Secure` in production.
- The browser talks to one origin through the gateway, so no CORS credentials juggling is needed.
- A `Bearer` header is also accepted, for Swagger and tests.
- Merchant machine-to-machine calls use `X-Api-Key` instead (ADR is in M5's brief).

## Consequences

- Tokens are not readable by JavaScript, which removes the XSS token-theft risk.
- SSE and the Google OAuth redirect work naturally with cookies.
- CSRF is mitigated by SameSite=Lax plus JSON-only mutating endpoints. M2 adds an Origin check on
  state-changing auth endpoints.
