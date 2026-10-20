import request from 'supertest';
import { createTestApp, type TestContext } from '../utils/app';

describe('GET /api/v1/health', () => {
  let t: TestContext;
  beforeAll(async () => (t = await createTestApp()));
  afterAll(() => t.close());

  it('reports database status and echoes a request id', async () => {
    const res = await request(t.http).get('/api/v1/health').set('X-Request-Id', 'test-123');
    expect(res.body.checks.db).toBe(true);
    expect(res.headers['x-request-id']).toBe('test-123');
  });
});
