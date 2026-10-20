# Git workflow

## Branches and PRs

- `main` is protected: it needs a PR, 1 approval (from the CODEOWNER if their path is touched) and
  green CI. Nobody pushes directly.
- Branch names follow `mNN/<short-topic>`, for example `m04/status-transitions`.
- PRs are small and frequent: aim for under 400 changed lines and one concern each. Merge vertical
  slices continuously, not one big branch at the end.
- Use Conventional Commits: `feat(courier): proof of delivery upload`, `fix(pricing): round per-kg up`,
  `test(...)`, `docs(...)`, `chore(...)`.
- Rebase on `main` before requesting review. Prefer "Squash and merge".

## Avoiding conflicts

- Stay in your owned paths (AGENTS.md §3). Shared registration points are pre-wired.
- New files never conflict, so prefer adding a file over editing a shared one.
- Prettier runs on commit (husky + lint-staged), so formatting never shows up as a diff.

## Resolving the usual conflicts

| File                                                    | Do this                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `pnpm-lock.yaml`                                        | `git checkout --theirs pnpm-lock.yaml` (take main's) → `make install` → commit |
| `packages/db/prisma/migrations/*`                       | delete **your** unmerged migration → rebase → `make migrate name=…`            |
| generated (`schema.d.ts`, `openapi.json`, `generated/`) | not in git, so run `make gen` / `make install`                                 |
| someone else's file                                     | don't resolve it yourself; ask the owner                                       |

## Board

Use GitHub Projects with the columns Todo → In Progress → Review → Blocked → Done. Every issue has
one owner and acceptance criteria (use the issue templates).
