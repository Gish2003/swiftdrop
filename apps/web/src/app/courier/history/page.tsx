import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'History' };

/**
 * Owner: M6. TODO(M6): GET /api/v1/courier/history.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function CourierHistoryPage() {
  return (
    <>
      <PageHeader title={'History'} description="Completed and failed deliveries" />
      <NotImplemented owner="M6" doc="docs/members/M06-courier-app.md" />
    </>
  );
}
