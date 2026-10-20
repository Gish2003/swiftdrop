# ADR-0004: Live tracking with SSE fed by RabbitMQ

**Status:** accepted · **Owner:** M4

## Decision

- `GET /api/v1/tracking/:tn/events` is a `text/event-stream` endpoint.
- Each API instance binds an **exclusive, auto-delete queue** `api.sse.<uuid>` to
  `parcel.status_changed.*`, so every instance sees every event. It then filters by tracking number
  in memory.
- Clients first fetch the REST snapshot, then open an `EventSource`. If the stream fails, they
  reconnect with backoff and fall back to polling.
- The SSE payload is the privacy-safe `TrackingSseMessage` (tracking number, status, timestamp only).
- Caddy streams it without buffering (`flush_interval -1`).

## Consequences

- Updates are horizontally scalable without sticky sessions.
- A slightly delayed update (outbox poll) is acceptable.
