import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Delivery details' };

/**
 * Owner: M3. TODO(M3): GET /api/v1/parcels/{id}; receipt link /api/v1/parcels/{id}/receipt; live status via the M4 tracking component.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CustomerParcelsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <PageHeader title={`Delivery details — ${id}`} description="Status history and receipt" />
      <NotImplemented owner="M3" doc="docs/members/M03-customer-booking.md" />
    </>
  );
}
