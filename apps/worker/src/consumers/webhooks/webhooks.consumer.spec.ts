import { isRetryable } from './webhooks.consumer';

describe('isRetryable', () => {
  it('retries network errors, 408, 429 and 5xx', () => {
    for (const s of [null, 408, 429, 500, 503]) expect(isRetryable(s)).toBe(true);
  });

  it('does not retry other 4xx', () => {
    for (const s of [400, 401, 404, 410]) expect(isRetryable(s)).toBe(false);
  });
});
