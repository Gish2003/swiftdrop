# Architecture overview

Owner: M1. Diagrams: [../diagrams/architecture.md](../diagrams/architecture.md). Decisions: [adr/](adr/).

## Scope and priorities

| Priority                | Scope                                                                                                                                                                                                                                                  | Evidence                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **P0 required**         | Auth + roles; customer booking + fee estimate; parcel lifecycle + public tracking; merchant approval + secured order API; courier updates; dispatcher assignment; pricing/zones; RabbitMQ event flow; notifications; merchant webhooks; Docker Compose | E2E demo, documented APIs, integration + authorization tests, runnable deployment |
| **P1 required quality** | Google OAuth, receipts, proof of delivery, reporting, audit history, webhook retries, validation, centralized errors, env config, coverage report                                                                                                      | Demonstrable flows, test + coverage output                                        |
| **P2 stretch**          | Kubernetes, AI delivery assistant                                                                                                                                                                                                                      | Only after P0 + P1 are stable                                                     |

**Non-goals:** route optimisation, live GPS fleet tracking, native mobile apps, a real billing platform,
and splitting the backend into microservices.

## Runtime components

| Component  | Tech               | Responsibility                                                                     |
| ---------- | ------------------ | ---------------------------------------------------------------------------------- |
| `gateway`  | Caddy              | Single origin `:8080`. `/api/*` → api, everything else → web. SSE is not buffered. |
| `web`      | Next.js 16         | Portals for customer, merchant, courier, dispatch and admin, plus public tracking  |
| `api`      | NestJS 11          | REST `/api/v1`, business rules, auth guards, SSE, Swagger                          |
| `worker`   | NestJS app context | Outbox relay, notification consumer, webhook consumer                              |
| `postgres` | PostgreSQL 17      | Source of truth (`swiftdrop`, `swiftdrop_test`, `swiftdrop_shadow`)                |
| `rabbitmq` | RabbitMQ 4         | Topic exchange `swiftdrop.events`, durable work queues, DLX `swiftdrop.dlx`        |
| `minio`    | RustFS (S3 API)    | Private proof-of-delivery files                                                    |
| `mailpit`  | Mailpit            | Captures outgoing email in dev                                                     |

## API module map

| Module                   | Owner | Exposes (public service) | Depends on                 |
| ------------------------ | ----- | ------------------------ | -------------------------- |
| auth                     | M2    | `AuthService`            | users                      |
| users                    | M2    | `UsersService`           | —                          |
| bookings                 | M3    | —                        | parcels                    |
| parcels (+ tracking SSE) | M4    | `ParcelsService`         | pricing, outbox            |
| pricing                  | M7    | `PricingService`         | —                          |
| dispatch                 | M7    | `DispatchService`        | (audit, outbox)            |
| courier                  | M6    | —                        | parcels, dispatch, storage |
| merchants                | M5    | `MerchantsService`       | users                      |
| merchant-api             | M5    | —                        | merchants, parcels         |
| reports                  | M9    | —                        | —                          |
| audit (global)           | M9    | `AuditService`           | —                          |
| event-ops                | M8    | —                        | —                          |
| health                   | M10   | —                        | infra                      |
| dev-login                | M1    | —                        | — (dev only)               |

Global infrastructure that can be injected anywhere: `PrismaService`, `OutboxService`,
`RabbitMqService`, `StorageService`, `TokenService`, `AuditService`.

## Key flows

1. **Booking.** `POST /parcels` (customer) → `BookingsService` → `ParcelsService.create`
   (`PricingService.estimate` computes the fee) → one transaction: parcel + CREATED history + outbox
   `parcel.created`.
2. **Assignment.** `POST /dispatch/assignments` → one transaction: assignment + audit + outbox
   `parcel.courier_assigned`.
3. **Status update.** `PATCH /courier/parcels/:id/status` checks the courier's active assignment, then
   `ParcelsService.transition` → one transaction: parcel + history + outbox `parcel.status_changed`.
4. **Events.** The worker relay publishes outbox rows. Three consumers act on them:
   - notifications sends email or mock SMS;
   - webhooks POSTs HMAC-signed payloads with retries and a DLQ;
   - each API instance's SSE queue pushes the update to `/tracking/:tn/events`.

Sequence diagrams: [../diagrams/sequences.md](../diagrams/sequences.md).

## Cross-cutting

- **Errors.** Every error has the shape `{ error: { code, message, details?, requestId } }`. See
  [../conventions/errors.md](../conventions/errors.md).
- **Correlation.** The `X-Request-Id` header is accepted or generated, echoed back, logged, and
  copied into event `correlationId`.
- **Logging.** pino, JSON in production and pretty output in dev. Secrets and PII are redacted.
- **Config.** Env vars are validated with zod at boot (`apps/*/src/config/env.ts`). The full list is
  in `.env.example`.
- **Security.** See [../conventions/security.md](../conventions/security.md) and
  [../contracts/authorization-matrix.md](../contracts/authorization-matrix.md).
