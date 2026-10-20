# ADR-0002: Transactional outbox for domain events

**Status:** accepted · **Owner:** M8

## Context

Publishing to RabbitMQ after a DB commit can fail, which would lose the event. Publishing before the
commit can announce a change that later rolls back.

## Decision

- Services write the event to the `outbox_events` table in the **same transaction** as the business
  change, using `OutboxService.enqueue(tx, type, data)`.
- The worker's relay polls unpublished rows (`FOR UPDATE SKIP LOCKED`), publishes them with
  publisher confirms, and sets `publishedAt`.
- Delivery is at-least-once, so every consumer is idempotent through the `processed_events` table.
- Work queues dead-letter to `swiftdrop.dlx`, which feeds a `<queue>.dlq` per queue.

## Consequences

- No event is lost between the commit and the publish.
- Duplicates are possible, which is why consumers must deduplicate.
- Events arrive about one poll interval late (around 1 s), which is fine for notifications and tracking.
