# ADR-0001: Modular monolith + separate worker

**Status:** accepted (Week 1) · **Owner:** M1

## Context

We have 10 developers and 8 weeks. The brief needs asynchronous integration, but microservices
would add deployment, distributed transactions and debugging cost we cannot afford.

## Decision

- One NestJS API process with one module per business area, plus one worker process for
  asynchronous consumers.
- Modules talk to each other only through services exported from their `index.ts`. ESLint enforces this.
- Domain rules have a single owner:
  - parcels own status transitions;
  - pricing owns fees;
  - audit owns audit records.

## Consequences

- Business changes that span several tables can use plain PostgreSQL transactions.
- Each developer owns a folder, which keeps merge conflicts rare.
- The worker can scale independently, and a module can be extracted later if a real need appears.
- Module boundaries depend on discipline: code review and the lint rule have to hold them.
