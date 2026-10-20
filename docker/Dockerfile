# syntax=docker/dockerfile:1.7
# One Dockerfile, several targets. Owner: M10.
#   dev     — used by compose.yaml for every Node service (source is bind-mounted, hot reload)
#   api / worker / web — slim production images used by compose.prod.yaml
ARG NODE_VERSION=24.22.0
ARG PNPM_VERSION=12.14.0

# ── base ─────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS base
ARG PNPM_VERSION
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@${PNPM_VERSION}
ENV PNPM_HOME=/pnpm CI=true NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ── dev (bind-mounted source; node_modules live in named volumes) ────────────
FROM base AS dev
ENV NODE_ENV=development
RUN pnpm config set store-dir /pnpm-store --global
CMD ["sleep", "infinity"]

# ── build (whole monorepo) ───────────────────────────────────────────────────
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm-store \
  pnpm config set store-dir /pnpm-store --global && pnpm install --frozen-lockfile
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN pnpm build:packages \
  && pnpm --filter @swiftdrop/api build \
  && pnpm --filter @swiftdrop/worker build \
  && pnpm --filter @swiftdrop/web build
RUN pnpm deploy --filter @swiftdrop/api --prod --legacy /out/api \
  && pnpm deploy --filter @swiftdrop/worker --prod --legacy /out/worker

# ── api (prod) ───────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out/api ./
COPY --from=build /app/apps/api/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]

# ── worker (prod) ────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS worker
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out/worker ./
COPY --from=build /app/apps/worker/dist ./dist
USER node
CMD ["node", "dist/main.js"]

# ── migrate (prod one-shot: prisma migrate deploy) ───────────────────────────
FROM build AS migrate
WORKDIR /app/packages/db
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]

# ── web (prod, Next.js standalone output) ────────────────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS web
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
