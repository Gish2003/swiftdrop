import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Book a delivery' };

/**
 * Owner: M3. TODO(M3): form → POST /api/v1/pricing/estimate (show fee) → POST /api/v1/parcels → show tracking number.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CustomerBookPage() {
  return (
    <>
      <PageHeader
        title={'Book a delivery'}
        description="Pickup, drop-off, size and weight — instant price"
      />
      <NotImplemented owner="M3" doc="docs/members/M03-customer-booking.md" />
    </>
  );
}
