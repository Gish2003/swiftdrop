# Team

Fill in names and GitHub handles, then replace the `@swiftdrop-mNN` placeholders in
`.github/CODEOWNERS` with the real handles (M1 task, Week 1).

| #   | Role                                    | Brief                                               | Name  | GitHub |
| --- | --------------------------------------- | --------------------------------------------------- | ----- | ------ |
| M1  | Technical lead & backend foundation     | [M01](members/M01-tech-lead.md)                     | _TBD_ | @…     |
| M2  | Authentication & user management        | [M02](members/M02-auth-users.md)                    | _TBD_ | @…     |
| M3  | Customer portal & booking               | [M03](members/M03-customer-booking.md)              | _TBD_ | @…     |
| M4  | Parcel lifecycle & live tracking        | [M04](members/M04-parcel-lifecycle-tracking.md)     | _TBD_ | @…     |
| M5  | Merchant portal & partner API           | [M05](members/M05-merchant-portal-api.md)           | _TBD_ | @…     |
| M6  | Courier application                     | [M06](members/M06-courier-app.md)                   | _TBD_ | @…     |
| M7  | Dispatch, admin & pricing               | [M07](members/M07-dispatch-admin-pricing.md)        | _TBD_ | @…     |
| M8  | RabbitMQ, notifications & webhooks      | [M08](members/M08-events-notifications-webhooks.md) | _TBD_ | @…     |
| M9  | Reporting, audit & operational insights | [M09](members/M09-reporting-audit.md)               | _TBD_ | @…     |
| M10 | DevOps & quality engineering            | [M10](members/M10-devops-quality.md)                | _TBD_ | @…     |

## Working agreements

- Each morning, post an async update with three lines: yesterday, today, blockers.
- Hold two integration checkpoints a week (suggested Tue + Fri). At each one, `main` must pass `make check` and the demo flow so far must work.
- Demo working software every week. Screenshots alone don't count.
- Raise a blocker within half a day. Don't wait several days for another module.
- Public API and event contracts freeze at the end of Week 2. After that, breaking changes need M1's approval.
