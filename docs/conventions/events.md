# Events & messaging

Owner: M8. Contracts: `packages/contracts/src/events.ts`. Catalog: [../contracts/event-catalog.md](../contracts/event-catalog.md).

## Producing an event (API side)

Write it to the outbox **inside the same transaction** as the change:

```ts
await this.prisma.$transaction(async (tx) => {
  // …business writes…
  await this.outbox.enqueue(tx, 'parcel.status_changed', {
    parcelId,
    trackingNumber,
    merchantId,
    customerId,
    previousStatus,
    newStatus,
    actorRole,
  });
});
```

`enqueue` builds the envelope (`eventId`, `eventVersion`, `occurredAt`, `correlationId`) and
validates it with zod. Never publish to RabbitMQ directly from the API.

## Envelope

`{ eventId (uuid), eventType, eventVersion: 1, occurredAt (ISO), correlationId, data }`.
The routing key is `<eventType>.v<version>`, for example `parcel.status_changed.v1`.

**Payload minimisation:** events contain IDs, statuses and reason codes only. They never include
names, phone numbers, emails or addresses. Consumers that need contact details load them from the DB.

## Topology

| Exchange / queue              | Type                        | Bound to                          | Notes                                   |
| ----------------------------- | --------------------------- | --------------------------------- | --------------------------------------- |
| `swiftdrop.events`            | topic exchange              | —                                 | all domain events                       |
| `notifications.parcel-events` | durable queue               | `parcel.#`                        | DLX → `swiftdrop.dlx`                   |
| `webhooks.parcel-events`      | durable queue               | `parcel.#`                        | DLX → `swiftdrop.dlx`                   |
| `<queue>.dlq`                 | durable queue               | `swiftdrop.dlx` (rk = queue name) | inspect in RabbitMQ UI and `/admin/ops` |
| `api.sse.<uuid>`              | exclusive auto-delete queue | `parcel.status_changed.*`         | one per API instance (M4)               |

## Consumer rules

1. Validate with `domainEvent.safeParse`. Malformed messages are dead-lettered immediately.
2. Make the consumer idempotent with `markProcessed(prisma, '<consumer>', eventId)`. Return early on
   duplicates.
3. Retry only transient failures (network, timeouts, 408/429/5xx) with bounded backoff (for example
   10 s → 1 min → 5 min). After the last retry the message is dead-lettered and recorded as `DEAD`.
4. Don't retry permanent failures (other 4xx, validation). Record them as `FAILED`.
5. Log the `eventId` and `correlationId`, never the payload's personal data or secrets.

## Webhooks (merchant callbacks)

- `POST <endpoint.url>` with a JSON body equal to the event envelope.
- Headers:
  - `X-SwiftDrop-Event-Id`;
  - `X-SwiftDrop-Event-Type`;
  - `X-SwiftDrop-Signature: t=<unix>,v1=<hex HMAC-SHA256(secret, "<t>.<rawBody>")>`.
- Timeout is `WEBHOOK_TIMEOUT_MS`. Each attempt is stored in `webhook_attempts`.
- During secret rotation, sign with the new secret. Receivers may verify with either secret for 24 h.
