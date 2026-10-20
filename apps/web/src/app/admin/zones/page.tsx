import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Delivery zones' };

/**
 * Owner: M7. TODO(M7): GET/POST/PATCH /api/v1/admin/zones.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminZonesPage() {
  return (
    <>
      <PageHeader title={'Delivery zones'} description="Cities served by each zone" />
      <NotImplemented owner="M7" doc="docs/members/M07-dispatch-admin-pricing.md" />
    </>
  );
}
