/**
 * @swiftdrop/db — Prisma client factory + generated types.
 * Import models/enums from here: `import { Prisma, ParcelStatus, type Parcel } from '@swiftdrop/db'`.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

export * from '../generated/prisma/client';

export function createPrismaClient(
  connectionString: string | undefined = process.env.DATABASE_URL,
): PrismaClient {
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/** Re-exported so apps don't need a direct adapter dependency. */
export { PrismaPg } from '@prisma/adapter-pg';
