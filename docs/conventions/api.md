# REST API conventions

Owner: M1. Applies to every controller in `apps/api`.

## URLs and methods

- Prefix `/api/v1`, set globally, so controllers declare only their own path.
- Resource names are plural nouns in kebab-case: `/pricing-rules`, `/api-keys`.
- "My" resources use `/me` (`/users/me`, `/merchants/me/webhooks`). Admin resources go under
  `/admin/...`.
- Actions that aren't CRUD are a sub-resource with POST: `POST /admin/merchants/:id/approve`,
  `POST /me/webhooks/:id/rotate-secret`.

| Method | Use              | Success code                                                                     |
| ------ | ---------------- | -------------------------------------------------------------------------------- |
| GET    | read             | 200                                                                              |
| POST   | create           | 201 (default) or `@HttpCode(200)` for actions/queries like `/estimate`, `/login` |
| PATCH  | partial update   | 200                                                                              |
| DELETE | delete or revoke | 204                                                                              |

## Requests

- Bodies are JSON. The only exception is file uploads, which use `multipart/form-data`.
- Every input is a DTO class with `class-validator` decorators. The global ValidationPipe sets
  `whitelist` and `forbidNonWhitelisted`, so unknown fields are rejected with a 400.
- Use `@ApiProperty` / `@ApiPropertyOptional` on every DTO field. That is our only source of Swagger
  schemas.
- **Never accept ownership IDs from the client.** Take `customerId`, `merchantId`, `courierId` and
  `actorId` from the session (`@CurrentUser()`) or from the API key (`req.merchantId`).
- Money is an integer number of minor units (`feeCents`) plus a `currency` (`LKR`). Never use floats.
- Dates are ISO-8601 strings in UTC.
- Cities are lower-cased and trimmed before zone lookup.

## Responses

- A single resource is returned as the plain object (`ParcelDto`).
- Lists use `{ data: T[], meta: { page, pageSize, total } }`. Extend `PaginationQuery` for
  `?page=1&pageSize=20`; the maximum `pageSize` is 100. Build the result with
  `paginated(data, total, q)`.
- Filters are plain query params (`?status=IN_TRANSIT&from=2026-11-01`).
- Return DTOs, never Prisma models. Map explicitly so new columns (for example `passwordHash` or
  `internalNotes`) never leak.
- Errors follow [errors.md](errors.md).

## Auth decorators

| Decorator                                | Meaning                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| _(none)_                                 | any authenticated user                                                            |
| `@Roles('ADMIN', 'DISPATCHER')`          | role-level restriction (class or method)                                          |
| `@Public()`                              | no JWT needed (tracking, estimate, register, login, merchant API + its own guard) |
| `@UseGuards(ApiKeyGuard)`                | merchant partner API                                                              |
| `@Throttle({ default: { limit, ttl } })` | stricter rate limit (auth, public tracking)                                       |

Role checks are only the first layer. Object-level checks belong in the service; see
[security.md](security.md).

## Swagger / typed client

- Each controller has `@ApiTags('<module>')`; the tags are pre-registered in `app.factory.ts`.
- After changing routes or DTOs, run `make gen`. It regenerates `apps/api/openapi.json` and
  `apps/web/src/lib/api/schema.d.ts`, and web type errors then show what broke.

## Versioning

`/api/v1` is frozen after Week 2. Additive changes are fine: new optional fields and new endpoints.
For a breaking change, open a "contract change" issue and get M1's approval.
