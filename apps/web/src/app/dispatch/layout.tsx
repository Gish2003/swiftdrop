import { PortalShell } from '@/components/layout/PortalShell';
import { dispatchNav } from '@/config/nav/dispatch';
import { requireRole } from '@/lib/auth/session';

/**
 * Dispatch portal shell. Owner: M7. Server-side role check via the API (requireRole).
 */
export default async function DispatchLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['DISPATCHER', 'ADMIN']);
  return (
    <PortalShell title="Dispatch" nav={dispatchNav} user={user}>
      {children}
    </PortalShell>
  );
}
