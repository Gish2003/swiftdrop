import { PortalShell } from '@/components/layout/PortalShell';
import { customerNav } from '@/config/nav/customer';
import { requireRole } from '@/lib/auth/session';

/**
 * Customer portal shell. Owner: M3. Server-side role check via the API (requireRole).
 */
export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['CUSTOMER']);
  return (
    <PortalShell title="Customer" nav={customerNav} user={user}>
      {children}
    </PortalShell>
  );
}
