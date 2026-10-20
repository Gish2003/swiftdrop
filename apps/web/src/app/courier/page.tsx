import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'My deliveries' };

/**
 * Owner: M6. TODO(M6): GET /api/v1/courier/parcels — mobile-first cards.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CourierPage() {
  return (
    <>
      <PageHeader title={'My deliveries'} description="Parcels assigned to you" />
      <NotImplemented owner="M6" doc="docs/members/M06-courier-app.md" />
    </>
  );
}
