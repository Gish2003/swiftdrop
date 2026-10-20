import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Orders' };

/**
 * Owner: M5. TODO(M5): list merchant parcels (add a portal endpoint or reuse merchant API via session).
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function MerchantOrdersPage() {
  return (
    <>
      <PageHeader title={'Orders'} description="Parcels created through your API" />
      <NotImplemented owner="M5" doc="docs/members/M05-merchant-portal-api.md" />
    </>
  );
}
