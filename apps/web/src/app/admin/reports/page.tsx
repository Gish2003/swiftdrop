import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Reports' };

/**
 * Owner: M9. TODO(M9): GET /api/v1/admin/reports/* with date-range filters.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminReportsPage() {
  return (
    <>
      <PageHeader title={'Reports'} description="Volume, success rate and courier performance" />
      <NotImplemented owner="M9" doc="docs/members/M09-reporting-audit.md" />
    </>
  );
}
