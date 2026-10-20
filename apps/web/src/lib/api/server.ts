/**
 * Typed API client for SERVER components / route handlers / server actions.
 * Calls the API container directly and forwards the user's cookies. Owner: M1.
 *
 *   const api = await serverApi();
 *   const { data } = await api.GET('/api/v1/parcels/mine');
 */
import { cookies } from 'next/headers';
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export async function serverApi() {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return createClient<paths>({
    baseUrl: process.env.API_INTERNAL_URL ?? 'http://localhost:4000',
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: 'no-store',
  });
}
