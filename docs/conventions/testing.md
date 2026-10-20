# Testing strategy

Coordinated by M10. Every owner writes tests for their own code.

| Type            | Where                                                                            | Run                           | Owner                         |
| --------------- | -------------------------------------------------------------------------------- | ----------------------------- | ----------------------------- |
| Unit            | `src/**/*.spec.ts` next to the code (api, worker, contracts)                     | `make test`                   | each owner                    |
| API integration | `apps/api/test/<module>/*.e2e-spec.ts`                                           | `make test-int`               | each API owner                |
| Authorization   | `apps/api/test/auth-matrix/` (role level) + negative cases in each module folder | `make test-int`               | M2 coordinates, everyone adds |
| Event flow      | `apps/api/test/events/` + worker specs                                           | `make test-int` / `make test` | M8                            |
| End-to-end      | `apps/e2e/tests/<journey>.spec.ts`                                               | `make e2e`                    | M10 + journey owners          |

## Integration tests

```ts
import request from 'supertest';
import { createTestApp, type TestContext } from '../utils/app';

describe('GET /api/v1/parcels/:id', () => {
  let t: TestContext;
  beforeAll(async () => (t = await createTestApp()));
  afterAll(() => t.close());

  it('returns 404 for another customer’s parcel', async () => {
    const parcel = await t.prisma.parcel.findFirstOrThrow({
      where: { customer: { email: 'customer@swiftdrop.test' } },
    });
    await request(t.http)
      .get(`/api/v1/parcels/${parcel.id}`)
      .set('Cookie', await t.cookieFor('CUSTOMER', 'customer2@swiftdrop.test'))
      .expect(404);
  });
});
```

- The DB is `swiftdrop_test`. It is migrated, truncated and seeded **once per run**
  (`test/utils/global-setup.ts`). Tests share that state, so create your own rows with unique values
  rather than relying on counts.
- `t.cookieFor(role, email?)` signs a real access token for a seeded user, so you don't need the
  login endpoint.
- **Every endpoint must have at least one negative authorization test:** wrong role, another user's
  resource, or another merchant's data.

## What to unit test (minimum)

| Area                  | Examples                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Status transitions    | Every allowed and disallowed pair; FAILED needs a reason; DELIVERED needs proof; max attempts |
| Pricing               | Rule specificity and priority; per-kg rounding; unserviced city                               |
| Assignment            | Courier capacity; already assigned; parcel not in an assignable status                        |
| Webhooks              | Signature generation; retry decision (`isRetryable`); backoff schedule                        |
| Validation edge cases | Phone formats; weight bounds; file type and size                                              |

## Coverage

`make coverage` writes `apps/api/coverage/{unit,integration}`. CI uploads coverage artifacts on
every PR. Target at least 70 % lines on business services. The test report for submission is
assembled by M10 in Week 7.
