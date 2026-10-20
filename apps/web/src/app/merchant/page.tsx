import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Merchant dashboard' };

/**
 * Owner: M5. TODO(M5): GET /api/v1/merchants/me — show PENDING banner until approved.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function MerchantPage() {
  return (
    <>
      <PageHeader title={'Merchant dashboard'} description="Approval status and order overview" />
      <NotImplemented owner="M5" doc="docs/members/M05-merchant-portal-api.md" />
    </>
  );
}
