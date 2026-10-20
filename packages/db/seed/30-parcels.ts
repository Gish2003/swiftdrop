// Owner: M4. A few demo parcels in different statuses, each with consistent status history.
import type { ParcelStatus, PrismaClient } from '../src';

const PATHS: Record<string, ParcelStatus[]> = {
  SD100000001: ['CREATED'],
  SD100000002: ['CREATED', 'PICKED_UP', 'IN_TRANSIT'],
  SD100000003: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'],
};

export async function seedParcels(prisma: PrismaClient) {
  const customer = await prisma.user.findUniqueOrThrow({
    where: { email: 'customer@swiftdrop.test' },
  });
  const cmb = await prisma.deliveryZone.findUniqueOrThrow({ where: { code: 'CMB' } });
  const kdy = await prisma.deliveryZone.findUniqueOrThrow({ where: { code: 'KDY' } });

  for (const [trackingNumber, path] of Object.entries(PATHS)) {
    const exists = await prisma.parcel.findUnique({ where: { trackingNumber } });
    if (exists) continue;
    const status = path[path.length - 1];
    await prisma.parcel.create({
      data: {
        trackingNumber,
        status,
        customerId: customer.id,
        senderName: 'Nimali Customer',
        senderPhone: '+94770000001',
        pickupAddress: '12 Galle Road',
        pickupCity: 'colombo',
        pickupZoneId: cmb.id,
        recipientName: 'Test Recipient',
        recipientPhone: '+94770000002',
        dropoffAddress: '5 Temple Street',
        dropoffCity: 'kandy',
        dropoffZoneId: kdy.id,
        size: 'SMALL',
        weightKg: 1.5,
        feeCents: 52500,
        deliveredAt: status === 'DELIVERED' ? new Date() : null,
        statusHistory: {
          create: path.map((to, i) => ({
            fromStatus: i === 0 ? null : path[i - 1],
            toStatus: to,
            actorRole: 'SYSTEM',
            note: 'seed',
          })),
        },
      },
    });
  }
}
