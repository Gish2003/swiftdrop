import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Delivery' };

/**
 * Owner: M6. TODO(M6): PATCH /api/v1/courier/parcels/{id}/status; POST /proof (multipart, camera capture on mobile).
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CourierParcelsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <PageHeader
        title={`Delivery — ${id}`}
        description="Update status, capture proof or failure reason"
      />
      <NotImplemented owner="M6" doc="docs/members/M06-courier-app.md" />
    </>
  );
}
