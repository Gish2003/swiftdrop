/**
 * Prepares the TEST database once per `test:int` run:
 *   1. `prisma migrate deploy` (applies pending migrations, non-destructive)
 *   2. TRUNCATE every table except _prisma_migrations
 *   3. seed demo data
 * Hard-guarded to databases whose name ends in `_test` — it can never touch the dev database.
 */
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { createPrismaClient } from '@swiftdrop/db';

export default async function globalSetup() {
  const url =
    process.env.TEST_DATABASE_URL ??
    'postgresql://swiftdrop:swiftdrop@localhost:5432/swiftdrop_test';
  if (!/\/[\w-]+_test(\?|$)/.test(url))
    throw new Error(`Refusing to touch non-test database: ${url}`);

  const env = { ...process.env, DATABASE_URL: url };
  const cwd = join(__dirname, '../../../../packages/db');
  execSync('pnpm exec prisma migrate deploy', { cwd, env, stdio: 'inherit' });

  const prisma = createPrismaClient(url);
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
    if (tables.length) {
      const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
    }
  } finally {
    await prisma.$disconnect();
  }

  execSync('pnpm seed', { cwd, env, stdio: 'inherit' });
}
