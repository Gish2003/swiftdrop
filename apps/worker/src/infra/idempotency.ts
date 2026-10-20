import type { PrismaClient } from '@swiftdrop/db';

/**
 * Returns true the FIRST time (consumer, eventId) is seen, false for duplicates.
 * Use it to make every consumer idempotent (at-least-once delivery ⇒ duplicates WILL happen).
 * Owner: M8.
 */
export async function markProcessed(
  prisma: PrismaClient,
  consumer: string,
  eventId: string,
): Promise<boolean> {
  const res = await prisma.processedEvent.createMany({
    data: [{ consumer, eventId }],
    skipDuplicates: true,
  });
  return res.count === 1;
}
