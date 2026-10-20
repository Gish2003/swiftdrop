# Security checklist

Applies to everyone. Authorization matrix: [../contracts/authorization-matrix.md](../contracts/authorization-matrix.md).

## Authentication (M2)

- Passwords are hashed with argon2id (`argon2.hash(pw, { type: argon2.argon2id })`). Never log them or
  return the hash.
- Access JWTs are short-lived (15 min), HS256, with issuer and audience checked. Refresh tokens are
  random 256-bit values; store only a SHA-256 hash, rotate on use, and revoke the whole chain if a
  token is reused.
- Google OAuth uses the authorization-code flow with `state` and PKCE stored in short-lived httpOnly
  cookies. Verify the `id_token` server-side with `google-auth-library`. **Never** trust a profile
  sent by the client.
- Use `@Throttle` on login, register and refresh, and on public tracking.

## Authorization (everyone)

- Role checks use `@Roles(...)`. **Object-level checks belong in the service query**, for example
  `where: { id, customerId: user.id }`. If nothing is found, return 404.
- Tenancy for merchants: `merchantId` always comes from the session or API key, never from input.
- Couriers can act only on parcels with their own ACTIVE assignment.
- Hiding a button in the UI is not authorization. The API must refuse.

## Merchant API keys (M5)

- Format: `sd_live_<8-char prefix>_<32-byte random base64url>`. Store `prefix` and `sha256(key)`.
  Show the raw key once. Support revoke and rotate. Accept keys only in the `X-Api-Key` header, never
  in URLs. Never log keys; the logger already redacts `x-api-key`.

## Data protection

- **Public tracking** shows only the tracking number, status, history (status, time, reason code),
  and origin/destination **city**. It must not show names, phone numbers, street addresses or
  internal notes.
- **Events** carry IDs only (see [events.md](events.md)).
- **Logs** never contain bodies with personal data, tokens, cookies or secrets. Mask recipients
  (`j***@example.com`, `***123`).
- **Uploads** (M6): check size and magic bytes, and generate the object key on the server. Files live
  in a private bucket and are streamed only after an authorization check.
- **Webhook secrets** are encrypted at rest (AES-256-GCM with `WEBHOOK_SECRET_ENC_KEY`) and shown
  once at creation or rotation.

## Platform

- Helmet, CORS allow-list and `COOKIE_SECURE=true` in production. `ENABLE_DEV_LOGIN` is refused in
  production at boot.
- Secrets live only in `.env`, which is gitignored. `.env.example` holds dev placeholders only.
- Sensitive admin actions write an audit log via `AuditService.record` (M9). This covers merchant
  approval, role changes, pricing and zone changes, assignments, API key create and revoke, and
  webhook secret rotation.
