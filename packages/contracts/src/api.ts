/** Shared REST conventions. See docs/conventions/api.md. Owner: M1. */
export const API_PREFIX = '/api/v1';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

/** Cookie names set by the auth module (M2). httpOnly, SameSite=Lax, Secure in prod. */
export const AUTH_COOKIES = {
  ACCESS: 'sd_access',
  REFRESH: 'sd_refresh',
} as const;

/** Header carrying merchant API keys on /api/v1/merchant/* partner endpoints (M5). */
export const MERCHANT_API_KEY_HEADER = 'X-Api-Key';

/** Header propagated through requests and events for tracing. */
export const CORRELATION_ID_HEADER = 'X-Request-Id';
