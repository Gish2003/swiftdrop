import { NotImplemented, PageHeader } from '@/components/ui';
import { requireRole } from '@/lib/auth/session';

export const metadata = { title: 'Overview' };

/**
 * Owner: M9. TODO(M9): headline numbers from /api/v1/admin/reports/deliveries.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminPage() {
  await requireRole(['ADMIN']);
  return (
    <>
      <PageHeader title={'Overview'} description="Operational summary" />
      <NotImplemented owner="M9" doc="docs/members/M09-reporting-audit.md" />
    </>
  );
}
