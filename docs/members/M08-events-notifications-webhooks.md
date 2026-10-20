# M08: RabbitMQ, notifications & webhooks

> **Kick-off prompt for your agent**
> "I am M8 on SwiftDrop. Read AGENTS.md, then docs/members/M08-events-notifications-webhooks.md,
> docs/conventions/events.md, docs/contracts/event-catalog.md and ADR-0002. Implement my Week-N tasks only
> inside my owned paths (apps/worker, apps/api/src/infra/events, apps/api/src/modules/event-ops). Find stubs
> with `grep -rn "TODO(M8)\|notImplemented('M8')" apps`. Write unit + integration tests for idempotency,
> retries and dead-lettering, then run `make check`."

## Mission

Reliable asynchronous integration, which the assignment explicitly requires. You own:

- the event contract;
- the transactional-outbox relay;
- RabbitMQ topology;
- the notification consumer (email via Mailpit, mock SMS);
- the merchant webhook delivery with HMAC signatures, retries, backoff and a dead-letter queue;
- idempotency;
- operator visibility.

## You own

- `apps/worker/**` (except `src/health/`, which is M10's)
- `apps/api/src/infra/events/` (OutboxService, RabbitMqService), `apps/api/src/modules/event-ops/`, `apps/api/test/events/`
- `packages/contracts/src/events.ts` (with M1), `packages/db/prisma/schema/events.prisma`
- Web: `src/app/admin/ops/`, `src/features/ops/`
- Docs: `docs/conventions/events.md`, `docs/contracts/event-catalog.md`

## Already in place (scaffold)

- `OutboxService.enqueue(tx, type, data)`: builds and validates the envelope, inserts an `outbox_events` row.
- `RabbitMqService` (api, used by M4 for SSE) and the worker's `RabbitMqService`:
  - publish with confirms;
  - `consume`, which acks on success and nacks/dead-letters on throw.
- `assertTopology()`: exchange `swiftdrop.events`, DLX `swiftdrop.dlx`, and the
  `notifications.parcel-events` and `webhooks.parcel-events` queues, each with a `.dlq`.
- `markProcessed()` idempotency helper, `MailProvider` (SMTP → Mailpit, mock SMS),
  `isRetryable()` with a spec, `GET /admin/ops/outbox`.

## To implement

1. **Outbox relay** (`OutboxRelayService.relayOnce`):
   - in a transaction, `SELECT … FROM outbox_events WHERE "publishedAt" IS NULL ORDER BY "createdAt" LIMIT $n FOR UPDATE SKIP LOCKED`;
   - publish each row with `routingKey` and header `x-correlation-id`;
   - set `publishedAt`. On failure, set `attempts++` and `lastError`, and stop the batch to keep ordering.
   - Optionally, clean up published rows older than 7 days.
2. **Retries with bounded backoff.** Create per-delay retry queues (`<queue>.retry.10s`, `.60s`, `.300s`),
   each with `x-message-ttl` and dead-lettering back to the work queue. Track the attempt in a message
   header (`x-attempt`). Transient failure → publish to the next retry queue and ack. Retries exhausted
   or a permanent failure → nack, which dead-letters to the DLQ. Configure delays with
   `WEBHOOK_RETRY_DELAYS_MS`.
3. **Notifications consumer:**
   - validate with `domainEvent`, then run `markProcessed`;
   - load the parcel, customer and recipient from the DB;
   - templates for CREATED (booking confirmation), OUT_FOR_DELIVERY, DELIVERED and FAILED;
   - email the customer (if any) and `recipientEmail` (if any), plus a mock SMS to the recipient phone (masked);
   - write a `NotificationLog`, with the unique `(eventId, channel, recipient)` index as a second
     idempotency guard. Treat provider errors as transient.
4. **Webhooks consumer:**
   - only for events with a `merchantId`;
   - for each active endpoint subscribed to the event type: sign
     `t=<unix>,v1=hex(hmac_sha256(secret, "<t>.<body>"))`, decrypting the secret with
     `WEBHOOK_SECRET_ENC_KEY` (agree the helper with M5);
   - POST with `AbortSignal.timeout(WEBHOOK_TIMEOUT_MS)`;
   - record a `WebhookAttempt` per try (status, responseStatus, durationMs, nextRetryAt);
   - 2xx → SUCCEEDED; retryable → retry; otherwise → FAILED; retries exhausted → DEAD.
   - Fan-out to multiple endpoints must not re-send to endpoints that already succeeded. Track this
     per endpoint (e.g. `processed_events` consumer key `webhooks:<endpointId>`).
5. **Operator visibility:**
   - `GET /admin/ops/webhook-attempts?status=DEAD` (paginated);
   - `POST /admin/ops/webhook-attempts/:id/retry`: re-queue it (publish to the webhooks queue with a
     header targeting that endpoint) and write an audit entry;
   - optionally a DLQ depth from the RabbitMQ management API;
   - a `/admin/ops` page.
6. **Dev helper (optional but great for demos):** a `webhook-echo` service in compose under the `dev`
   profile (coordinate with M10) that logs received webhooks, plus a merchant endpoint pointing at it
   in the seed (with M5).

## Event contract duties

- **Confirm `docs/contracts/event-catalog.md` by day 2 of Week 1.** Freeze after Week 2.
- Payload minimisation: IDs and statuses only. Consumers load PII from the DB.

## Tests required

- Unit:
  - signature generation and verification;
  - `isRetryable` (done);
  - the backoff schedule and next-delay function;
  - template rendering;
  - recipient masking.
- Integration (`test/events/`, needs RabbitMQ and the worker logic):
  - **outbox → relay → queue**: insert an outbox row, run `relayOnce`, and assert a message on a temp
    queue bound to `parcel.#` with `publishedAt` set;
  - **duplicate event** → notification sent once (`NotificationLog` count = 1);
  - **unavailable merchant endpoint** (closed port) → attempt FAILED then retried, finally DEAD + DLQ;
  - a 4xx endpoint → no retry;
  - **status change → notification + webhook**: the Week-5 exit test.
- Coordinate the end-to-end assertion with M10 (Mailpit API `GET http://mailpit:8025/api/v1/messages`).

## Week-by-week

| Week | Tasks                                                                                                           | Exit                                                                        |
| ---- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1    | Confirm the event schema, routing keys and consumer ownership. Agree webhook signature/secret handling with M5. | Contract agreed                                                             |
| 2    | Outbox relay working. Consumers log valid events. Stub SSE path verified with M4.                               | Events visible in the RabbitMQ UI                                           |
| 3–4  | Notifications consumer + Mailpit. Webhook delivery happy path.                                                  | Email visible in Mailpit                                                    |
| 5    | Retry/backoff, DLQ, idempotency, attempt records, ops endpoints                                                 | **Status change → notification + webhook in a repeatable integration test** |
| 6    | Ops page, webhook-echo demo service, edge cases                                                                 | —                                                                           |
| 7    | Failure-handling tests (duplicates, unavailable endpoint, provider error)                                       | Green                                                                       |
| 8    | Demo step 6, docs                                                                                               | —                                                                           |

## Status / notes

_Update as you go._
