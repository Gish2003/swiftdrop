import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { domainEvent, routingKey, type DomainEvent, type EventType } from '@swiftdrop/contracts';
import type { Prisma } from '@swiftdrop/db';
import { RequestContext } from '../../common/request-context/request-context';

type DataOf<T extends EventType> = Extract<DomainEvent, { eventType: T }>['data'];

/**
 * Transactional outbox (ADR-0002). Call `enqueue` INSIDE the same `$transaction` as the business
 * change; the worker's outbox relay (M8) publishes it to RabbitMQ after commit.
 *
 *   await this.prisma.$transaction(async (tx) => {
 *     await tx.parcel.update(...);
 *     await tx.parcelStatusHistory.create(...);
 *     await this.outbox.enqueue(tx, 'parcel.status_changed', { ...data });
 *   });
 *
 * Owner: M8.
 */
@Injectable()
export class OutboxService {
  async enqueue<T extends EventType>(
    tx: Prisma.TransactionClient,
    eventType: T,
    data: DataOf<T>,
  ): Promise<DomainEvent> {
    const event = domainEvent.parse({
      eventId: randomUUID(),
      eventType,
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      correlationId: RequestContext.correlationId(),
      data,
    });
    await tx.outboxEvent.create({
      data: {
        id: event.eventId,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        routingKey: routingKey(event.eventType, event.eventVersion),
        payload: event as unknown as Prisma.InputJsonValue,
        correlationId: event.correlationId,
      },
    });
    return event;
  }
}
