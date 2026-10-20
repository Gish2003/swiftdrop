import { NotImplemented, PageHeader } from '@/components/ui';
import { requireRole } from '@/lib/auth/session';

export const metadata = { title: 'Event operations' };

/**
 * Owner: M8. TODO(M8): GET /api/v1/admin/ops/outbox + webhook-attempts?status=DEAD + retry.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminOpsPage() {
  await requireRole(['ADMIN']);
  return (
    <>
      <PageHeader
        title={'Event operations'}
        description="Outbox backlog and dead-lettered webhooks"
      />
      <NotImplemented owner="M8" doc="docs/members/M08-events-notifications-webhooks.md" />
    </>
  );
}
