import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'My deliveries' };

/**
 * Owner: M3. TODO(M3): GET /api/v1/parcels/mine → Table with StatusBadge, link to detail + receipt download.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CustomerPage() {
  return (
    <>
      <PageHeader title={'My deliveries'} description="Your bookings and their live status" />
      <NotImplemented owner="M3" doc="docs/members/M03-customer-booking.md" />
    </>
  );
}
