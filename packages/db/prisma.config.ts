import { defineConfig, env } from 'prisma/config';

// Prisma 7 config. The schema is split across prisma/schema/*.prisma (one file per module owner).
export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx seed/index.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
    // Needed by the drift check (`pnpm migrate:diff`, run in CI). Created by docker/postgres/init.sql.
    ...(process.env.SHADOW_DATABASE_URL
      ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL }
      : {}),
  },
});
