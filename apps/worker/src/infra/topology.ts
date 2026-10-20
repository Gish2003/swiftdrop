/**
 * RabbitMQ topology owned by the worker (ADR-0002, docs/conventions/events.md). Owner: M8.
 *
 *   swiftdrop.events (topic) ──parcel.#──▶ notifications.parcel-events ──x-dead-letter──▶ swiftdrop.dlx ─▶ notifications.parcel-events.dlq
 *                             ──parcel.#──▶ webhooks.parcel-events      ──x-dead-letter──▶ swiftdrop.dlx ─▶ webhooks.parcel-events.dlq
 *
 * Retries with bounded backoff: TODO(M8) — e.g. per-delay retry queues `<queue>.retry.<ms>` with
 * x-message-ttl that dead-letter back to the main queue, then to the DLQ after the last delay.
 */
import { DEAD_LETTER_EXCHANGE, EVENTS_EXCHANGE, QUEUES } from '@swiftdrop/contracts';
import type { Channel } from 'amqplib';

export const WORK_QUEUES = [QUEUES.NOTIFICATIONS, QUEUES.WEBHOOKS] as const;

export async function assertTopology(ch: Channel): Promise<void> {
  await ch.assertExchange(EVENTS_EXCHANGE, 'topic', { durable: true });
  await ch.assertExchange(DEAD_LETTER_EXCHANGE, 'direct', { durable: true });
  for (const q of WORK_QUEUES) {
    await ch.assertQueue(`${q}.dlq`, { durable: true });
    await ch.bindQueue(`${q}.dlq`, DEAD_LETTER_EXCHANGE, q);
    await ch.assertQueue(q, {
      durable: true,
      deadLetterExchange: DEAD_LETTER_EXCHANGE,
      deadLetterRoutingKey: q,
    });
    await ch.bindQueue(q, EVENTS_EXCHANGE, 'parcel.#');
  }
}
