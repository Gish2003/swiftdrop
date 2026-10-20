import { NotImplemented, PageHeader } from '@/components/ui';
import { requireRole } from '@/lib/auth/session';

export const metadata = { title: 'Users' };

/**
 * Owner: M2. TODO(M2): GET/POST/PATCH /api/v1/admin/users.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminUsersPage() {
  await requireRole(['ADMIN']);
  return (
    <>
      <PageHeader title={'Users'} description="Manage staff and customer accounts" />
      <NotImplemented owner="M2" doc="docs/members/M02-auth-users.md" />
    </>
  );
}
