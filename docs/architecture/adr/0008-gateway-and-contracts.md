# ADR-0008: Contracts-first integration

**Status:** accepted · **Owner:** M1

## Decision

- **Shared constants and types live in `packages/contracts`**: roles, statuses, the transition
  graph, event schemas (zod), error codes and cookie/header names.
- **Every planned endpoint exists from day 1** as a typed stub (a DTO plus `@Roles`) that returns
  `501`. Swagger therefore documents the whole API immediately.
- **The web app consumes a typed client generated from OpenAPI** (`openapi-typescript` +
  `openapi-fetch`). The generated file is gitignored and regenerated with `make gen`.
- **Contracts freeze at the end of Week 2.** After that, changes must be additive or approved by M1.

## Consequences

- The frontend and backend can be built in parallel.
- Type errors surface contract drift immediately.
