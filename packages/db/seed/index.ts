/**
 * Seed runner. Each member owns their numbered seed file; this runner is pre-wired — do not edit it,
 * add your data to your own file instead. Seeds must be idempotent (use upsert).
 * Run: `make seed` (or `pnpm --filter @swiftdrop/db seed`).
 */
import { createPrismaClient } from '../src';
import { seedUsers } from './00-users';
import { seedZonesAndPricing } from './10-zones-pricing';
import { seedMerchants } from './20-merchants';
import { seedParcels } from './30-parcels';

async function main() {
  const prisma = createPrismaClient();
  try {
    await seedUsers(prisma);
    await seedZonesAndPricing(prisma);
    await seedMerchants(prisma);
    await seedParcels(prisma);
    console.warn('✔ seed complete');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
