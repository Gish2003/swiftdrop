import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'API keys' };

/**
 * Owner: M5. TODO(M5): GET/POST/DELETE /api/v1/merchants/me/api-keys — show the raw key ONCE after creation.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function MerchantApiKeysPage() {
  return (
    <>
      <PageHeader title={'API keys'} description="Create, view and revoke partner API keys" />
      <NotImplemented owner="M5" doc="docs/members/M05-merchant-portal-api.md" />
    </>
  );
}
