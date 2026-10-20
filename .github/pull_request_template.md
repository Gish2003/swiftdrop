## What & why

<!-- One concern per PR. Link the issue/board card. -->

Member: M__ · Module(s): ___

## How to test

<!-- Exact steps / curl / pages. Screenshots for UI changes. -->

## Checklist (Definition of Done: AGENTS.md §8)

- [ ] Only touches paths I own, or the owner is tagged for review
- [ ] Server-side validation + `@Roles` + object-level authorization
- [ ] Unit tests + integration tests incl. negative authorization cases
- [ ] `make check` passes locally
- [ ] Ran `make gen` if API routes/DTOs changed. Swagger is accurate
- [ ] New env vars added to `.env.example` + zod schema
- [ ] Migration generated on latest `main` (if schema changed)
- [ ] No secrets/PII in logs, errors, events or fixtures
- [ ] Docs updated (member brief status, contracts if affected)
