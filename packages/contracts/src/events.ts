/**
 * Event contracts published to RabbitMQ. Owner: M8 (events), with M4 for parcel payloads.
 * Frozen after Week 2. Additive changes only; breaking changes need a new eventVersion.
 * See docs/contracts/event-catalog.md and docs/conventions/events.md.
 */
import { z } from 'zod';
import { PARCEL_STATUSES } from './parcel-status';
import { ROLES } from './roles';

/** Topic exchange that all domain events are published to. */
export const EVENTS_EXCHANGE = 'swiftdrop.events';
/** Dead-letter exchange; failed messages land in `<queue>.dlq`. */
export const DEAD_LETTER_EXCHANGE = 'swiftdrop.dlx';

export const EVENT_TYPES = {
  PARCEL_STATUS_CHANGED: 'parcel.status_changed',
  PARCEL_CREATED: 'parcel.created',
  COURIER_ASSIGNED: 'parcel.courier_assigned',
} as const;
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/** Routing key = `<eventType>.v<version>`, e.g. `parcel.status_changed.v1`. */
export function routingKey(eventType: EventType, version: number): string {
  return `${eventType}.v${version}`;
}

/** Queue names consumed by the worker / api. */
export const QUEUES = {
  NOTIFICATIONS: 'notifications.parcel-events',
  WEBHOOKS: 'webhooks.parcel-events',
  /** Per-API-instance exclusive queue prefix for SSE fan-out (M4). */
  SSE_PREFIX: 'api.sse.',
} as const;

const envelope = <T extends string, D extends z.ZodTypeAny>(eventType: T, data: D) =>
  z.object({
    eventId: z.uuid(),
    eventType: z.literal(eventType),
    eventVersion: z.literal(1),
    occurredAt: z.iso.datetime(),
    correlationId: z.string().min(1),
    data,
  });

/** Payload minimisation: NO names, phone numbers, addresses or emails in events. */
export const parcelStatusChangedV1 = envelope(
  EVENT_TYPES.PARCEL_STATUS_CHANGED,
  z.object({
    parcelId: z.string(),
    trackingNumber: z.string(),
    merchantId: z.string().nullable(),
    customerId: z.string().nullable(),
    previousStatus: z.enum(PARCEL_STATUSES).nullable(),
    newStatus: z.enum(PARCEL_STATUSES),
    actorRole: z.enum([...ROLES, 'SYSTEM']),
    failureReason: z.string().nullable().optional(),
  }),
);
export type ParcelStatusChangedV1 = z.infer<typeof parcelStatusChangedV1>;

export const parcelCreatedV1 = envelope(
  EVENT_TYPES.PARCEL_CREATED,
  z.object({
    parcelId: z.string(),
    trackingNumber: z.string(),
    merchantId: z.string().nullable(),
    customerId: z.string().nullable(),
  }),
);
export type ParcelCreatedV1 = z.infer<typeof parcelCreatedV1>;

export const courierAssignedV1 = envelope(
  EVENT_TYPES.COURIER_ASSIGNED,
  z.object({
    parcelId: z.string(),
    trackingNumber: z.string(),
    courierId: z.string(),
    assignedById: z.string(),
  }),
);
export type CourierAssignedV1 = z.infer<typeof courierAssignedV1>;

export const domainEvent = z.discriminatedUnion('eventType', [
  parcelStatusChangedV1,
  parcelCreatedV1,
  courierAssignedV1,
]);
export type DomainEvent = z.infer<typeof domainEvent>;

/** Shape of the public SSE message sent to tracking clients (no private data). */
export interface TrackingSseMessage {
  trackingNumber: string;
  status: (typeof PARCEL_STATUSES)[number];
  occurredAt: string;
}

/** HTTP headers on outgoing merchant webhooks. */
export const WEBHOOK_HEADERS = {
  SIGNATURE: 'X-SwiftDrop-Signature', // `t=<unix>,v1=<hex hmac-sha256 of "t.body">`
  EVENT_ID: 'X-SwiftDrop-Event-Id',
  EVENT_TYPE: 'X-SwiftDrop-Event-Type',
} as const;
