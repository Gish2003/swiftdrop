# AGENTS.md — SwiftDrop

> Read this file completely before changing anything. Then read **your member brief** in
> `docs/members/` (ask your human which member number they are if you don't know).
> This file is the single source of truth for every AI coding agent (Claude Code, Codex, Cursor,
> Copilot, …) working in this repository.

## 1. What we are building

SwiftDrop is an island-wide parcel delivery and courier management system (university team project,
10 members, 8 weeks). The system has five kinds of users:

- **Customers** book deliveries, get a fee estimate and track parcels live.
- **Merchants** create parcels through a secured partner API and receive webhooks.
- **Couriers** update delivery status and capture proof of delivery.
- **Dispatchers** assign parcels to couriers and manage zones and pricing.
- **Admins** manage users, approve merchants, and view reports and audit logs.

Assessment rewards **correct business rules, secure role-based access, reliable async integration,
tests, documentation and a working demo**, not visual polish. Scope priorities (P0 → P2) are in
`docs/architecture/overview.md`.

## 2. Architecture in one minute

```
Browser ──► gateway (Caddy :8080) ──/api/*──► api (NestJS modular monolith :4000) ──► PostgreSQL
                    └──────── /* ─────────► web (Next.js :3000)        │  outbox rows
                                                                       ▼
                     worker (NestJS) ◄── RabbitMQ (swiftdrop.events) ◄─ outbox relay (in worker)
                       ├─ notifications consumer → Mailpit (email) / mock SMS
                       └─ webhooks consumer → merchant endpoints (HMAC-signed, retries, DLQ)
```

- **Modular monolith**: one API process, one NestJS module per business area. There are no microservices.
- **PostgreSQL is the source of truth**. Business changes and the event they produce are written in
  **one transaction** via the **transactional outbox** (`OutboxService.enqueue(tx, …)`). The worker
  publishes outbox rows to RabbitMQ.
- **Auth**: short-lived access JWT in the httpOnly cookie `sd_access`, plus a rotating refresh token in
  `sd_refresh`. Global guards: `JwtAuthGuard` → `RolesGuard`. Merchant partner API uses `X-Api-Key`.
- **Live tracking**: Server-Sent Events. Each API instance consumes parcel events from its own
  exclusive RabbitMQ queue and pushes them to browsers.
- **Files** (proof of delivery) live in private S3-compatible storage (RustFS, service name `minio`)
  and are streamed through authorized API endpoints.

Decisions and their reasons are in `docs/architecture/adr/`.

## 3. Repository map and ownership

Owners (M1–M10) are listed in `docs/TEAM.md`, and `.github/CODEOWNERS` enforces them.

| Path                                                                  | What                                                             | Owner                               |
| --------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------- |
| `apps/api/src/{main.ts,app.module.ts,app.factory.ts,config/,common/}` | API foundation, guards, errors                                   | M1                                  |
| `apps/api/src/common/auth/`                                           | JWT guard, roles guard, token/cookie helpers                     | M2 (built by M1)                    |
| `apps/api/src/infra/prisma/`                                          | PrismaService                                                    | M1                                  |
| `apps/api/src/infra/events/`                                          | OutboxService, RabbitMqService                                   | M8                                  |
| `apps/api/src/infra/storage/`                                         | StorageService (S3)                                              | M6                                  |
| `apps/api/src/modules/health/`                                        | health endpoint                                                  | M10                                 |
| `apps/api/src/modules/dev-login/`                                     | dev-only login-as                                                | M1                                  |
| `apps/api/src/modules/{auth,users}/`                                  | auth, OAuth, user management                                     | M2                                  |
| `apps/api/src/modules/bookings/`                                      | customer bookings, receipts                                      | M3                                  |
| `apps/api/src/modules/parcels/`                                       | lifecycle, status history, public tracking, SSE                  | M4                                  |
| `apps/api/src/modules/{merchants,merchant-api}/`                      | merchant portal, approval, API keys, webhook config, partner API | M5                                  |
| `apps/api/src/modules/courier/`                                       | courier workflow, proof of delivery                              | M6                                  |
| `apps/api/src/modules/{dispatch,pricing}/`                            | assignment, workload, zones, pricing                             | M7                                  |
| `apps/api/src/modules/event-ops/` + `apps/worker/`                    | event pipeline, notifications, webhooks                          | M8                                  |
| `apps/api/src/modules/{reports,audit}/`                               | reports, audit log                                               | M9                                  |
| `apps/api/test/<module>/`                                             | integration tests for that module                                | module owner                        |
| `apps/web/src/app/<portal>/…` and `apps/web/src/features/<feature>/`  | see `apps/web/src/features/README.md`                            | per page header comment             |
| `apps/web/src/{components/ui,components/layout,lib/api}/`             | shared UI kit, shell, API client                                 | M1 + M10                            |
| `apps/web/src/{proxy.ts,lib/auth/}`                                   | route guard, session helpers                                     | M2                                  |
| `apps/e2e/`                                                           | Playwright journeys                                              | M10 (each journey owner adds specs) |
| `packages/contracts/`                                                 | enums, status graph, event schemas, error codes                  | M1 (+M4 lifecycle, +M8 events)      |
| `packages/db/prisma/schema/<file>.prisma`                             | one file per owner (header comment says who)                     | see file                            |
| `packages/db/seed/NN-*.ts`                                            | seed data per owner                                              | see file                            |
| `docker/`, `compose*.yaml`, `Makefile`, `.github/`                    | infrastructure, CI                                               | M10                                 |
| `AGENTS.md`, `CLAUDE.md`, `docs/architecture/`, `docs/conventions/`   | team docs                                                        | M1                                  |

Every stub you need to implement contains a `TODO(Mx)` comment or calls `notImplemented('Mx')`.
To find your work, run `grep -rn "TODO(M4)\|notImplemented('M4')" apps packages`.

## 4. Golden rules (read twice)

1. **Stay inside your owned paths.** Do not edit files owned by another member, even to "quickly
   fix" something. If you need a change elsewhere, stop and tell your human what to ask for and who
   owns it. Opening a small separate PR to the owner's area for them to review is fine.
2. **New files are free; shared files are not.** Adding a new file anywhere in your area never
   conflicts. Editing shared registration points needs owner review. These are already pre-wired,
   so you should not need to touch them: `app.module.ts`, `worker.module.ts`, `seed/index.ts`,
   `config/nav/*`, `components/ui/*`, `.env.example`, `compose.yaml`.
3. **Cross-module calls go through the other module's `index.ts` only**:
   `import { ParcelsService } from '../parcels'`. Never import `../parcels/parcels.service` or
   another module's DTO files directly. ESLint enforces this.
4. **Never weaken security** to make something work. Do not remove guards, mark private routes
   `@Public()`, trust IDs from request bodies for tenancy, or disable validation. Every endpoint
   needs role checks (`@Roles`) **and** object-level checks in the service: "is this parcel MINE?"
   Return 404 for other people's resources.
5. **No secrets or PII in logs, errors, events or commits.** That means no passwords, tokens, API
   keys, webhook secrets, full addresses or phone numbers. Events carry IDs, not personal data.
6. **Parcel status only changes through `ParcelsService.transition()`** (M4). Fees only come from
   `PricingService` (M7). Audit entries only go through `AuditService.record()` (M9). Domain events
   are only written through `OutboxService.enqueue()` inside the business transaction (M8).
7. **Contracts are frozen after Week 2.** `packages/contracts` and public API shapes may only get
   additive changes. A breaking change needs M1's approval and a version bump.
8. **Tests are part of the feature.** Write unit tests for business rules, and integration tests with
   **negative authorization cases** for every endpoint you build. Don't delete or skip other
   people's tests.
9. **Never run destructive commands on the user's behalf**: `make db-reset`, `make nuke`,
   `prisma migrate reset`, `git push --force`, or deleting volumes. Ask your human first. Prisma
   blocks AI agents from `migrate reset` on purpose; do not try to bypass that check.
10. **Don't add dependencies casually.** Most libraries you need are already installed (see §7).
    If you really need a new one, add it only to your app's `package.json` and mention it in the PR.

## 5. Commands

Everything runs in Docker. On the host you only need Docker Desktop, `make` and git.

```bash
make up            # start everything → http://localhost:8080
make ps / logs s=api / sh s=api
make install       # after pulling: lockfile / contracts / schema changed
make migrate-deploy# after pulling: someone added a migration
make migrate name=add_parcel_notes   # after YOU edit a .prisma file
make gen           # regenerate OpenAPI + web API types (after changing API DTOs/routes)
make lint typecheck test test-int db-check   # = make check (run before every PR)
make e2e           # Playwright against the running stack
```

| URL                            | What                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------- |
| http://localhost:8080          | the app (always use this, not :3000)                                         |
| http://localhost:8080/api/docs | Swagger UI (OpenAPI JSON at `/api/docs-json`)                                |
| http://localhost:15672         | RabbitMQ (swiftdrop / swiftdrop)                                             |
| http://localhost:8025          | Mailpit, the captured emails                                                 |
| http://localhost:9001          | object storage console (swiftdrop / swiftdrop-secret)                        |
| `localhost:5432`               | Postgres (swiftdrop / swiftdrop, db `swiftdrop`, tests use `swiftdrop_test`) |

**Test accounts.** The password for all of them is `Password123!`. In dev you can also use the
one-click **Dev login** panel on `/login`.

| Email                                             | Role                                              |
| ------------------------------------------------- | ------------------------------------------------- |
| admin@swiftdrop.test                              | ADMIN                                             |
| dispatcher@swiftdrop.test                         | DISPATCHER                                        |
| courier1@swiftdrop.test, courier2@swiftdrop.test  | COURIER                                           |
| customer@swiftdrop.test, customer2@swiftdrop.test | CUSTOMER                                          |
| merchant@swiftdrop.test                           | MERCHANT (approved merchant "Lanka Books (Demo)") |

Demo tracking numbers: `SD100000001` (CREATED), `SD100000002` (IN_TRANSIT), `SD100000003` (DELIVERED).

## 6. How to implement things (patterns to copy)

### API endpoint (NestJS)

- Controller: thin. Use `@ApiTags`, `@Roles(...)`, DTO classes with `class-validator` and
  `@ApiProperty` decorators (we don't use the Swagger CLI plugin, so decorate explicitly), and
  `@CurrentUser() user: AuthUser`.
- Service: business logic, Prisma queries **scoped to the caller**, and transactions for multi-row
  changes.
- Errors: `throw new AppError('ERROR_CODE', 'message', HttpStatus.X, details?)` with codes from
  `packages/contracts/src/errors.ts` (append new codes there). Helpers: `notFound('Parcel')`,
  `forbidden()`. Never throw raw `Error` for expected cases.
- Lists: extend `PaginationQuery` and return `paginated(data, total, q)` → `{ data, meta }`.
- Remove the `notImplemented('Mx')` call when you implement a method.
- Full conventions: `docs/conventions/api.md`, `docs/conventions/errors.md`.

```ts
// status change + history + event, atomically (M4 owns this; others call parcels.transition)
await this.prisma.$transaction(async (tx) => {
  const updated = await tx.parcel.update({ where: { id }, data: { status: to } });
  await tx.parcelStatusHistory.create({ data: { parcelId: id, fromStatus, toStatus: to, actorId, actorRole } });
  await this.outbox.enqueue(tx, 'parcel.status_changed', { parcelId: id, trackingNumber, ... });
});
```

### Database change

Edit **only your own** `packages/db/prisma/schema/<file>.prisma`, then run
`make migrate name=<what_changed>` and commit both the schema and the new migration folder. Read
`docs/conventions/database-migrations.md` before your first migration; it explains the rebase rule.

### Web page (Next.js App Router)

- Pages in `apps/web/src/app/<portal>/…/page.tsx` stay thin. Components go in `src/features/<feature>/`.
- Server components fetch with `const api = await serverApi(); await api.GET('/api/v1/...')`.
  Client components use `api` from `@/lib/api/client`. Both are fully typed from the OpenAPI spec;
  run `make gen` after API changes.
- Use the UI kit `@/components/ui` (Button, Input, FormField, Table, StatusBadge, PageHeader, …) and
  the design tokens in `globals.css` (`bg-brand`, `text-muted`…). Don't hard-code colours.
- Handle loading, empty and error states. Show `error.message` from the API error body (`errorMessage()`).
- Portal layouts already enforce roles server-side. The UI is never the security boundary.
- More: `docs/conventions/frontend.md`.

### Events / worker

Read `docs/conventions/events.md` and `docs/contracts/event-catalog.md`. Consumers must be
idempotent (`markProcessed`), validate payloads with the zod schemas from `@swiftdrop/contracts`,
and never put PII in events.

## 7. Libraries already installed (use these, don't add alternatives)

| Need              | Library                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| API framework, DI | NestJS 11 (`@nestjs/common`, `@nestjs/core`)                                     |
| DB                | Prisma 7 via `@swiftdrop/db` (import `Prisma`, enums and model types from there) |
| Validation        | `class-validator` + `class-transformer` (API DTOs), `zod` (config, events)       |
| JWT               | `@nestjs/jwt` via `TokenService`                                                 |
| Password hashing  | `argon2` (argon2id)                                                              |
| Google OAuth      | `google-auth-library`                                                            |
| PDF receipts      | `pdfkit`                                                                         |
| File upload       | `@nestjs/platform-express` `FileInterceptor` (multer)                            |
| Object storage    | `minio` client via `StorageService`                                              |
| RabbitMQ          | `amqp-connection-manager` + `amqplib` via `RabbitMqService`                      |
| Email             | `nodemailer` (worker, SMTP → Mailpit)                                            |
| Rate limiting     | `@nestjs/throttler` (`@Throttle`, `@SkipThrottle`)                               |
| Web               | Next.js 16 App Router, React 19, Tailwind CSS 4, `openapi-fetch`, `clsx`         |
| Tests             | Jest 30 + `@swc/jest`, Supertest, Playwright                                     |

## 8. Definition of Done (every PR)

- [ ] Acceptance criteria from your member brief are met and the feature works in the docker stack.
- [ ] Server-side validation, `@Roles`, and object-level authorization are in place.
- [ ] Unit tests for business rules, plus integration tests including **negative auth cases**.
- [ ] `make check` passes (lint, typecheck, unit, integration, drift check).
- [ ] Swagger shows correct request/response schemas, and `make gen` was run if routes changed.
- [ ] No secrets or PII in logs/errors/events. Any new env var is added to `.env.example` and the zod schema.
- [ ] Docs updated: your member brief's "Status / notes" section and any affected `docs/contracts/*`.
- [ ] Small PR, one concern, branch `mNN/short-description`, filled-in PR template.

## 9. Git workflow (short version)

Full version: `docs/conventions/git-workflow.md`.

- `main` is protected. Work on `mNN/<topic>` branches and open small PRs often. Rebase on `main` before you open the PR.
- Commit messages follow Conventional Commits: `feat(parcels): validate status transitions`.
- Resolving conflicts:
  - **`pnpm-lock.yaml`**: take `main`'s version, then run `make install`. Never hand-merge it.
  - **Migrations**: delete your own unmerged migration folder, rebase, then regenerate with
    `make migrate name=…`. Never edit a migration that is already on `main`.
  - **Generated files** (`schema.d.ts`, `openapi.json`, `packages/db/generated`) are gitignored.
    Run `make gen` or `make install` to regenerate them.

## 10. When you are unsure

Prefer asking your human over guessing about scope, contracts or another member's module. When
something in this file conflicts with your member brief, this file wins. Tell M1 about the conflict
so it can be fixed.
