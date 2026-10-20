import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Courier workload' };

/**
 * Owner: M7. TODO(M7): GET /api/v1/dispatch/couriers/workload.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function DispatchCouriersPage() {
  return (
    <>
      <PageHeader title={'Courier workload'} description="Active parcels per courier" />
      <NotImplemented owner="M7" doc="docs/members/M07-dispatch-admin-pricing.md" />
    </>
  );
}
