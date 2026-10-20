import { PortalShell } from '@/components/layout/PortalShell';
import { courierNav } from '@/config/nav/courier';
import { requireRole } from '@/lib/auth/session';

/**
 * Courier portal shell. Owner: M6. Server-side role check via the API (requireRole).
 */
export default async function CourierLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['COURIER']);
  return (
    <PortalShell title="Courier" nav={courierNav} user={user}>
      {children}
    </PortalShell>
  );
}
