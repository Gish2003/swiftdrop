/**
 * Server-side session helpers. The API is the source of truth: we ask it who the user is.
 * Owner: M2.
 */
import { ROLE_HOME, type Role } from '@swiftdrop/contracts';
import { redirect } from 'next/navigation';
import { serverApi } from '../api/server';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function getSession(): Promise<SessionUser | null> {
  const api = await serverApi();
  const { data, response } = await api.GET('/api/v1/users/me');
  if (!response.ok || !data) return null;
  return { id: data.id, email: data.email, name: data.name, role: data.role };
}

/** Use in portal layouts: redirects to /login (no session) or the user's own portal (wrong role). */
export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect('/login');
  if (!roles.includes(user.role)) redirect(ROLE_HOME[user.role]);
  return user;
}
