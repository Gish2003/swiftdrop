# ADR-0007: Prisma schema split per owner + baseline migration

**Status:** accepted · **Owner:** M1

## Decision

- The Prisma 7 multi-file schema lives in `packages/db/prisma/schema/`, one file per owner.
- The full ER model was created up front in a single baseline migration, so members only make
  small, additive migrations.
- Cross-file relations (for example the back-relations on `User`) were pre-declared to avoid edits
  to other people's files.
- CI runs `prisma migrate diff --exit-code` to catch schema/migration drift.

## Consequences

- Schema conflicts are rare and easy to see.
- Migration ordering still needs the rebase-and-regenerate rule in
  [../../conventions/database-migrations.md](../../conventions/database-migrations.md).
