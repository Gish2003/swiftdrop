// Owner: M5. One approved demo merchant owned by merchant@swiftdrop.test.
// API keys are NOT seeded (raw key is shown only once) — create one from the merchant dashboard.
import type { PrismaClient } from '../src';

export async function seedMerchants(prisma: PrismaClient) {
  const owner = await prisma.user.findUniqueOrThrow({
    where: { email: 'merchant@swiftdrop.test' },
  });
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@swiftdrop.test' } });
  await prisma.merchant.upsert({
    where: { ownerUserId: owner.id },
    update: {},
    create: {
      ownerUserId: owner.id,
      businessName: 'Lanka Books (Demo)',
      contactEmail: 'merchant@swiftdrop.test',
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedById: admin.id,
    },
  });
}
