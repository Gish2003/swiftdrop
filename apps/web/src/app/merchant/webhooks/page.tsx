import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Webhooks' };

/**
 * Owner: M5. TODO(M5): CRUD /api/v1/merchants/me/webhooks + rotate-secret + attempts.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function MerchantWebhooksPage() {
  return (
    <>
      <PageHeader
        title={'Webhooks'}
        description="Endpoints, signing secrets and delivery attempts"
      />
      <NotImplemented owner="M5" doc="docs/members/M05-merchant-portal-api.md" />
    </>
  );
}
