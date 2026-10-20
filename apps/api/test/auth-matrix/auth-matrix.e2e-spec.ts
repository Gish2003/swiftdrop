/**
 * Role-level authorization smoke tests for the whole API surface.
 * Every module owner ADDS object-level negative tests in test/<module>/ (see docs/conventions/testing.md).
 * Coordinated by M2.
 */
import request from 'supertest';
import { createTestApp, type TestContext } from '../utils/app';

describe('authorization matrix (role level)', () => {
  let t: TestContext;
  beforeAll(async () => (t = await createTestApp()));
  afterAll(() => t.close());

  it('rejects unauthenticated requests with the standard error body', async () => {
    const res = await request(t.http).get('/api/v1/users/me').expect(401);
    expect(res.body).toEqual({
      error: expect.objectContaining({ code: 'UNAUTHENTICATED', requestId: expect.any(String) }),
    });
  });

  it('returns the current user for a valid session', async () => {
    const res = await request(t.http)
      .get('/api/v1/users/me')
      .set('Cookie', await t.cookieFor('CUSTOMER'))
      .expect(200);
    expect(res.body).toMatchObject({ role: 'CUSTOMER' });
    expect(res.body.passwordHash).toBeUndefined();
  });

  it.each([
    ['CUSTOMER', 'get', '/api/v1/dispatch/unassigned'],
    ['CUSTOMER', 'get', '/api/v1/admin/users'],
    ['COURIER', 'get', '/api/v1/admin/reports/deliveries'],
    ['MERCHANT', 'get', '/api/v1/courier/parcels'],
    ['DISPATCHER', 'get', '/api/v1/admin/users'],
    ['COURIER', 'post', '/api/v1/parcels'],
  ] as const)('%s cannot %s %s', async (role, method, path) => {
    const res = await request(t.http)
      [method](path)
      .set('Cookie', await t.cookieFor(role));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('rejects merchant API calls without an API key', async () => {
    const res = await request(t.http).get('/api/v1/merchant/parcels').expect(401);
    expect(res.body.error.code).toBe('INVALID_API_KEY');
  });

  it('validates request bodies (400 VALIDATION_FAILED)', async () => {
    const res = await request(t.http)
      .post('/api/v1/pricing/estimate')
      .send({ pickupCity: 'colombo', size: 'HUGE' })
      .expect(400);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
  });
});
