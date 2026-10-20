import { NotImplemented, PageHeader } from '@/components/ui';
import { requireRole } from '@/lib/auth/session';

export const metadata = { title: 'Merchants' };

/**
 * Owner: M5. TODO(M5): GET /api/v1/admin/merchants + approve/reject/suspend.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminMerchantsPage() {
  await requireRole(['ADMIN']);
  return (
    <>
      <PageHeader title={'Merchants'} description="Approve, reject or suspend merchants" />
      <NotImplemented owner="M5" doc="docs/members/M05-merchant-portal-api.md" />
    </>
  );
}
