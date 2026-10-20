import { NotImplemented, PageHeader } from '@/components/ui';

export const metadata = { title: 'Pricing rules' };

/**
 * Owner: M7. TODO(M7): GET/POST/PATCH /api/v1/admin/pricing-rules.
 * Put components in src/features/<your-feature>/ and keep this file thin.
 */
export default async function AdminPricingPage() {
  return (
    <>
      <PageHeader title={'Pricing rules'} description="Base fee and per-kg rates" />
      <NotImplemented owner="M7" doc="docs/members/M07-dispatch-admin-pricing.md" />
    </>
  );
}
