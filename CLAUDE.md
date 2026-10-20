# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- **Start every session** by reading your member brief: `docs/members/MNN-*.md`. If you don't
  know which member you are working for, ask.
- Use **plan mode** for anything that touches more than one module, a shared file, the Prisma
  schema or `packages/contracts`. Show the plan to your human before editing.
- Run commands through the Makefile (`make test`, `make test-int`, `make check`, `make migrate name=…`).
  The stack runs in Docker, so don't install Node dependencies on the host to "fix" errors.
- Before saying a task is done, run `make check`, and `make e2e` if you changed a user journey. Report
  failures honestly with the output.
- Never run `make db-reset`, `make nuke`, `prisma migrate reset` or force-pushes without explicit
  permission from your human (rule 9 in AGENTS.md).
- When the API surface changes, run `make gen` so the web app's types update.
- Keep PRs small. Commit only when your human asks. Use Conventional Commit messages.
