# ADR-0006: pnpm monorepo, everything in Docker

**Status:** accepted · **Owner:** M10

## Decision

- One repo, managed with pnpm 12 workspaces: `apps/*` and `packages/*`.
- Node 24 LTS and TypeScript 6.0 are pinned. We use TS 6.0 rather than 7 because typescript-eslint
  supports only `<6.1`.
- Dev runs fully in Docker Compose:
  - one shared dev image;
  - bind-mounted source with hot reload;
  - `node_modules` in named volumes;
  - one-shot `deps` and `migrate` services.
- The same Dockerfile has production targets (`api`, `worker`, `web`, `migrate`).
- NestJS 11 (CommonJS) was chosen over NestJS 12, which is ESM-only and makes Jest painful. NestJS 11
  is also what AI agents know best.

## Consequences

- Every member has an identical environment, so "works on my machine" problems disappear.
- The first `make up` takes a few minutes. Later runs start in seconds.
