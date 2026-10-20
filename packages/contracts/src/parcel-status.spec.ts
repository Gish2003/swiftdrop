import { PARCEL_STATUSES, PARCEL_TRANSITIONS, canTransition, isTerminal } from './parcel-status';

describe('parcel status graph', () => {
  it('defines transitions for every status', () => {
    for (const s of PARCEL_STATUSES) expect(PARCEL_TRANSITIONS[s]).toBeDefined();
  });

  it('allows the happy path', () => {
    expect(canTransition('CREATED', 'PICKED_UP')).toBe(true);
    expect(canTransition('PICKED_UP', 'IN_TRANSIT')).toBe(true);
    expect(canTransition('IN_TRANSIT', 'OUT_FOR_DELIVERY')).toBe(true);
    expect(canTransition('OUT_FOR_DELIVERY', 'DELIVERED')).toBe(true);
  });

  it('rejects skipping steps and leaving DELIVERED', () => {
    expect(canTransition('CREATED', 'DELIVERED')).toBe(false);
    expect(isTerminal('DELIVERED')).toBe(true);
  });
});
