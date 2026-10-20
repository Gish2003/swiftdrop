# Database & migrations

Owner: M1. Tooling: Prisma 7, schema split across `packages/db/prisma/schema/*.prisma`.

## Ownership

Each `.prisma` file starts with an `// Owner:` comment. **Only edit your own file.** If you need a
relation to another owner's model, the other side needs a back-relation field in their file.
Coordinate in one PR with both owners tagged. The common ones are already pre-declared.

## Changing the schema (your PR)

1. `git pull --rebase origin main` and `make migrate-deploy`, so you start from the latest schema.
2. Edit your `.prisma` file. Keep changes **additive** where possible: new tables, new nullable
   columns or columns with defaults.
3. Run `make migrate name=add_parcel_notes`. This creates `prisma/migrations/<timestamp>_add_parcel_notes/`,
   applies it, regenerates the client and restarts the api and worker.
4. Commit the `.prisma` change **and** the new migration folder together.
5. Run `make check`, which includes `db-check` (the drift check).

## Conflict rule: rebase and regenerate

If `main` gains a migration while your PR is open:

1. Delete **your own** unmerged migration folder.
2. Rebase on `main`, then run `make migrate-deploy`.
3. Run `make migrate name=<same name>` again to generate a fresh migration on top.

Never edit or delete a migration that is already on `main`. Never hand-edit SQL to "merge" two
migrations.

## Rules

- Use `@@map("snake_case")` table names and camelCase fields. IDs are `cuid()`, except the outbox
  `id`, which is the event UUID.
- Store money in `Int` minor units, never `Float`.
- Destructive changes (dropping or renaming a column) need a two-step plan and M1's approval.
- Seeds live in `packages/db/seed/NN-<owner-area>.ts`. They must be **idempotent** (upsert or
  check-before-insert). Only use fake data on `@swiftdrop.test` addresses.
- Use transactions (`prisma.$transaction(async (tx) => …)`) for related writes. Pass `tx` down to
  `OutboxService.enqueue`, `AuditService.record`, `DispatchService.getActiveAssignment` and so on.
- Import types and enums from `@swiftdrop/db`: `import { Prisma, ParcelStatus, type Parcel } from '@swiftdrop/db'`.

## Useful commands

`make psql`, `make studio` (Prisma Studio on :5555), `make seed`, and `make db-reset` (destructive;
**humans only**).
