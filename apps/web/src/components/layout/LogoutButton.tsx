'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

/** Owner: M2. Falls back to the dev logout while /auth/logout is not implemented yet. */
export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const res = await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    if (!res.ok) await fetch('/api/v1/dev/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
    router.refresh();
  }
  return (
    <Button variant="secondary" onClick={logout} className="px-3 py-1.5">
      Sign out
    </Button>
  );
}
