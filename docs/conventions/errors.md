# Error handling

Owner: M1. Implementation: `apps/api/src/common/errors/app-error.ts`,
`apps/api/src/common/filters/all-exceptions.filter.ts`.

## Response shape (every error)

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot go from CREATED to DELIVERED",
    "details": { "from": "CREATED", "to": "DELIVERED" },
    "requestId": "6f1c…"
  }
}
```

- `code` is stable and machine-readable. Codes come from `packages/contracts/src/errors.ts`; add new
  ones there (append-only).
- `message` is safe to show to users. It never contains stack traces, SQL, secrets or other people's data.
- `details` is optional, for example a validation error list or the offending values.
- `requestId` also appears in the `X-Request-Id` response header and in the logs. Ask bug reporters for it.

## Throwing

```ts
throw new AppError(
  'ZONE_NOT_SERVICED',
  'We do not deliver to that city yet',
  HttpStatus.UNPROCESSABLE_ENTITY,
  { city },
);
throw notFound('Parcel'); // 404 NOT_FOUND
throw forbidden(); // 403 FORBIDDEN
```

| Situation                        | Status     | Code                                                         |
| -------------------------------- | ---------- | ------------------------------------------------------------ |
| DTO validation failed            | 400        | VALIDATION_FAILED (automatic)                                |
| not signed in / bad token        | 401        | UNAUTHENTICATED (automatic)                                  |
| bad merchant API key             | 401        | INVALID_API_KEY                                              |
| role not allowed                 | 403        | FORBIDDEN (automatic via RolesGuard)                         |
| resource belongs to someone else | **404**    | NOT_FOUND (don't reveal it exists)                           |
| business rule violated           | 409 or 422 | specific code (INVALID_STATUS_TRANSITION, ALREADY_ASSIGNED…) |
| unique constraint (Prisma P2002) | 409        | CONFLICT (automatic)                                         |
| rate limited                     | 429        | RATE_LIMITED (automatic)                                     |
| unexpected                       | 500        | INTERNAL_ERROR (automatic; logged with stack)                |

## Frontend

Use `errorMessage(error)` / `errorCode(error)` from `@/lib/api/errors`. Branch on `code`, never on
`message`.
