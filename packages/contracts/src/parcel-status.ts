/**
 * Parcel lifecycle — the single shared definition of statuses and allowed transitions.
 * Owner: M4 (Parcel lifecycle). Frozen after Week 2; changes need M1 sign-off.
 * MUST stay identical to the `ParcelStatus` enum in packages/db/prisma/schema/parcel.prisma.
 *
 * See docs/contracts/parcel-lifecycle.md for the diagram and rules.
 */
export const PARCEL_STATUSES = [
  'CREATED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
] as const;
export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

/** Allowed next statuses for each status. DELIVERED is terminal. */
export const PARCEL_TRANSITIONS: Readonly<Record<ParcelStatus, readonly ParcelStatus[]>> = {
  CREATED: ['PICKED_UP'],
  PICKED_UP: ['IN_TRANSIT'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  FAILED: ['OUT_FOR_DELIVERY'], // re-attempt; capped by MAX_DELIVERY_ATTEMPTS
  DELIVERED: [],
};

/** Maximum number of OUT_FOR_DELIVERY attempts before a parcel stays FAILED. */
export const MAX_DELIVERY_ATTEMPTS = 3;

/** Statuses that require extra data on the transition request. */
export const STATUS_REQUIREMENTS: Partial<Record<ParcelStatus, 'proof' | 'reason'>> = {
  DELIVERED: 'proof',
  FAILED: 'reason',
};

export const FAILURE_REASONS = [
  'RECIPIENT_UNAVAILABLE',
  'ADDRESS_NOT_FOUND',
  'REFUSED',
  'DAMAGED',
  'OTHER',
] as const;
export type FailureReason = (typeof FAILURE_REASONS)[number];

export function canTransition(from: ParcelStatus, to: ParcelStatus): boolean {
  return PARCEL_TRANSITIONS[from].includes(to);
}

export function isTerminal(status: ParcelStatus): boolean {
  return PARCEL_TRANSITIONS[status].length === 0;
}

export const PARCEL_SIZES = ['SMALL', 'MEDIUM', 'LARGE'] as const;
export type ParcelSize = (typeof PARCEL_SIZES)[number];
