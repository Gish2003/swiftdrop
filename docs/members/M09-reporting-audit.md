# M09: Reporting, audit & operational insights

> **Kick-off prompt for your agent**
> "I am M9 on SwiftDrop. Read AGENTS.md, then docs/members/M09-reporting-audit.md and
> docs/conventions/security.md (audit + PII). Implement my Week-N tasks only inside my owned paths. Find stubs
> with `grep -rn "TODO(M9)\|notImplemented('M9')" apps`. Write unit + integration tests (including role
> checks), then run `make check`."

## Mission

Operational reporting covering daily volume, success and failure rates, and courier performance, plus
an **auditable history of sensitive actions**. Every other module records audit entries through your
service.

## You own

- API: `apps/api/src/modules/reports/`, `apps/api/src/modules/audit/` (global `AuditService`), `apps/api/test/reports/`
- `packages/db/prisma/schema/audit.prisma`
- Web: `src/app/admin/page.tsx` (overview), `src/app/admin/reports/`, `src/app/admin/audit/`, `src/features/{reports,audit}/`

## Interfaces you provide

| Interface                                                                                                       | Used by                            |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `AuditService.record({ actor, action, entityType, entityId, metadata?, ip? }, tx?)` ✅ basic insert works today | M2, M5, M7, M8 (and M4 optionally) |

**Action naming** (publish this list in this doc and keep it current):
`user.created`, `user.role_changed`, `user.deactivated`, `merchant.approved`, `merchant.rejected`,
`merchant.suspended`, `api_key.created`, `api_key.revoked`, `webhook.secret_rotated`, `zone.created`,
`zone.updated`, `pricing_rule.created`, `pricing_rule.updated`, `parcel.assigned`, `parcel.unassigned`,
`webhook_attempt.retried`.

Metadata holds small, non-sensitive context only (ids and before/after values of non-PII fields).
Parcel state changes already live in `parcel_status_history`, so reports read from there rather than
duplicating them into the audit log.

## Endpoints (stubs exist)

| Endpoint                                                                | Roles             | Output                                                                                                   |
| ----------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `GET /admin/reports/deliveries?from&to&zoneId`                          | ADMIN, DISPATCHER | `{ total, delivered, failed, inProgress, successRate }` (successRate = delivered / (delivered + failed)) |
| `GET /admin/reports/daily-volume?from&to&zoneId`                        | ADMIN, DISPATCHER | `[{ date, created, delivered, failed }]`, one row per day, including zero days                           |
| `GET /admin/reports/couriers?from&to`                                   | ADMIN, DISPATCHER | `[{ courierId, name, assigned, delivered, failed }]`                                                     |
| `GET /admin/audit-logs?action&entityType&entityId&actorId&from&to&page` | ADMIN             | paginated audit entries (actor name/email joined)                                                        |

- The default range is the last 30 days, capped at 366 days (400 `VALIDATION_FAILED` beyond that).
- Use Prisma `groupBy` or `$queryRaw` with `date_trunc('day', …)`. Parameterize every raw query
  (tagged template); **never** concatenate strings.
- Treat timezones explicitly: report in `Asia/Colombo` and document it.
- Add DB indexes in your own schema file if queries need them, through a migration.

## Web pages

- `/admin` overview: headline cards (today's bookings, in progress, delivered, success rate) and links.
- `/admin/reports`: date-range picker, zone filter, a daily volume chart (simple SVG/CSS bars are
  fine; don't add a chart library unless M1 agrees), a courier performance table, and a CSV export
  button (client-side CSV from the JSON).
- `/admin/audit`: filterable table (action, entity, actor, date) with metadata in an expandable row.

## Tests required

- Unit: success-rate maths (including divide by zero); date-range defaults and limits; filling zero days.
- Integration (`test/reports/`):
  - seed known parcels and history in the test, then assert the counts;
  - DISPATCHER can read reports but gets 403 on audit logs;
  - CUSTOMER → 403 on everything;
  - audit filters work;
  - `AuditService.record` inside a rolled-back transaction leaves no row.

## Week-by-week

| Week | Tasks                                                                              | Exit                           |
| ---- | ---------------------------------------------------------------------------------- | ------------------------------ |
| 1    | Publish the audit action list. Review `audit.prisma` and the report needs with M1. | Agreed                         |
| 3    | Audit log API + page. Help M5/M7 call `record`.                                    | Audit entries visible          |
| 5    | Audit logging coverage across modules (chase owners)                               | **Audit history demonstrable** |
| 6    | Reports API + admin overview + reports page                                        | **Operational dashboard**      |
| 7    | Report correctness tests, performance (indexes), CSV export                        | Green                          |
| 8    | Demo step 8 (reports), docs                                                        | —                              |

## Status / notes

_Update as you go._
