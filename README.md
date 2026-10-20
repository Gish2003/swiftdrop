# SwiftDrop

Parcel delivery & courier management system: customer bookings, live tracking, dispatcher
assignment, courier proof of delivery, merchant partner API with webhooks, and operational reporting.

**Stack**

- Next.js 16 · NestJS 11 (modular monolith) · PostgreSQL 17 + Prisma 7
- RabbitMQ (transactional outbox) · SSE · Docker Compose · Jest/Supertest/Playwright

> 🤖 Working with an AI coding agent? Point it at [AGENTS.md](AGENTS.md) and your brief in
> [docs/members/](docs/members/).

## Quick start

Prerequisites: Docker Desktop (≥ 4 GB RAM for Docker), `make`, git. Node is **not** required on the host.

```bash
git clone <repo-url> swiftdrop && cd swiftdrop
make up          # first run builds images, installs deps, migrates and seeds (~3–5 min)
make ps          # wait until api, web and worker show (healthy)
```

| What                   | URL                                                  |
| ---------------------- | ---------------------------------------------------- |
| App                    | http://localhost:8080                                |
| API docs (Swagger)     | http://localhost:8080/api/docs                       |
| RabbitMQ               | http://localhost:15672 (swiftdrop / swiftdrop)       |
| Mailpit (emails)       | http://localhost:8025                                |
| Object storage console | http://localhost:9001 (swiftdrop / swiftdrop-secret) |

**Test accounts.** The password for all of them is `Password123!`. In dev, `/login` also has a one-click
Dev login panel.

| Email                                              | Role                |
| -------------------------------------------------- | ------------------- |
| admin@swiftdrop.test                               | Admin               |
| dispatcher@swiftdrop.test                          | Dispatcher          |
| courier1@swiftdrop.test / courier2@swiftdrop.test  | Courier             |
| customer@swiftdrop.test / customer2@swiftdrop.test | Customer            |
| merchant@swiftdrop.test                            | Merchant (approved) |

Demo tracking numbers: `SD100000001`, `SD100000002`, `SD100000003`.

## Everyday commands

```bash
make help            # all targets
make logs s=api      # follow a service's logs
make sh s=api        # shell inside a container
make install         # after pulling dependency / contracts / schema changes
make migrate-deploy  # after pulling new migrations
make check           # lint + typecheck + unit + integration + migration drift (run before PRs)
make e2e             # Playwright journeys
make down            # stop (data is kept)
```

## Repository layout

```
apps/api        NestJS API (modules: auth, users, bookings, parcels, pricing, dispatch, courier, merchants, merchant-api, reports, audit, event-ops)
apps/worker     outbox relay + notification and webhook consumers
apps/web        Next.js portals: customer, merchant, courier, dispatch, admin
apps/e2e        Playwright tests
packages/contracts  shared enums, status graph, event schemas, error codes
packages/db     Prisma schema (split per module), migrations, seed
docker/         Dockerfile (dev + prod targets), Caddy gateway, Postgres init
docs/           architecture, ADRs, conventions, contracts, member briefs
```

## Documentation

- [AGENTS.md](AGENTS.md): rules, ownership map, patterns (start here)
- [docs/architecture/overview.md](docs/architecture/overview.md): architecture, scope and the
  [ADRs](docs/architecture/adr/)
- [docs/conventions/](docs/conventions/): API, errors, database migrations, events, testing, security, frontend, git
- [docs/contracts/](docs/contracts/): parcel lifecycle, authorization matrix, event catalog, endpoint list
- [docs/members/](docs/members/): one brief per team member
- [docs/TEAM.md](docs/TEAM.md): who is who

## Known limitations

- The scaffold ships the business endpoints as documented stubs that return `501 NOT_IMPLEMENTED`
  until their owner implements them.
- Google OAuth needs real credentials in `.env`.
- SMS is a mock provider that writes a log line. Email goes to Mailpit.
