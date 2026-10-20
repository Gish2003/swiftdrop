import { PortalShell } from '@/components/layout/PortalShell';
import { merchantNav } from '@/config/nav/merchant';
import { requireRole } from '@/lib/auth/session';

/**
 * Merchant portal shell. Owner: M5. Server-side role check via the API (requireRole).
 */
export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['MERCHANT']);
  return (
    <PortalShell title="Merchant" nav={merchantNav} user={user}>
      {children}
    </PortalShell>
  );
}
