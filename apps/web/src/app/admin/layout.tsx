import { PortalShell } from '@/components/layout/PortalShell';
import { adminNav } from '@/config/nav/admin';
import { dispatchNav } from '@/config/nav/dispatch';
import { requireRole } from '@/lib/auth/session';

/**
 * Admin portal shell. Owner: M1. Dispatchers may open zones/pricing/reports (shared with their nav);
 * ADMIN-only pages call requireRole(['ADMIN']) themselves. The API enforces roles regardless.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['ADMIN', 'DISPATCHER']);
  return (
    <PortalShell
      title={user.role === 'ADMIN' ? 'Admin' : 'Dispatch'}
      nav={user.role === 'ADMIN' ? adminNav : dispatchNav}
      user={user}
    >
      {children}
    </PortalShell>
  );
}
