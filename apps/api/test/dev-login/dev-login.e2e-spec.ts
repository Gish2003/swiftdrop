import request from 'supertest';
import { createTestApp, type TestContext } from '../utils/app';

describe('dev login (ENABLE_DEV_LOGIN=true)', () => {
  let t: TestContext;
  beforeAll(async () => (t = await createTestApp()));
  afterAll(() => t.close());

  it('sets an httpOnly access cookie and returns the role home', async () => {
    const res = await request(t.http)
      .post('/api/v1/dev/login-as')
      .send({ email: 'dispatcher@swiftdrop.test' })
      .expect(200);
    expect(res.body.home).toBe('/dispatch');
    expect(res.headers['set-cookie']?.[0]).toMatch(/^sd_access=.*HttpOnly/);
  });
});
