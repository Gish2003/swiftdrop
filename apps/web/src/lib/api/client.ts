'use client';
/**
 * Typed API client for CLIENT components. Types come from the API's OpenAPI spec
 * (`pnpm gen:api` → src/lib/api/schema.d.ts, gitignored, regenerated on dev/build).
 *
 *   const { data, error } = await api.POST('/api/v1/pricing/estimate', { body: { ... } });
 *
 * Requests go to the same origin (gateway) so the httpOnly session cookie is sent automatically.
 * Owner: M1.
 */
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const api = createClient<paths>({ baseUrl: '', credentials: 'include' });
