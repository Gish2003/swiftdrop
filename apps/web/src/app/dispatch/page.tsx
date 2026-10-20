import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Unassigned parcels' };

/**
 * Owner: M7. TODO(M7): GET /api/v1/dispatch/unassigned + POST /api/v1/dispatch/assignments.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function DispatchPage() {
  return (
    <>
      <PageHeader title={'Unassigned parcels'} description="Assign parcels to couriers" />
      <NotImplemented owner="M7" doc="docs/members/M07-dispatch-admin-pricing.md" />
    </>
  );
}
