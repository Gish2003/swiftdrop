import { NotImplemented, PageHeader } from '@/components/ui';
import { requireRole } from '@/lib/auth/session';

export const metadata = { title: 'Audit log' };

/**
 * Owner: M9. TODO(M9): GET /api/v1/admin/audit-logs with filters.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminAuditPage() {
  await requireRole(['ADMIN']);
  return (
    <>
      <PageHeader title={'Audit log'} description="Who did what, when" />
      <NotImplemented owner="M9" doc="docs/members/M09-reporting-audit.md" />
    </>
  );
}
