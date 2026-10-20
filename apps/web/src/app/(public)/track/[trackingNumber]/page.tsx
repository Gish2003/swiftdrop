import Link from 'next/link';
import { NotImplemented, PageHeader } from '@/components/ui';

/**
 * Public tracking page. Owner: M4.
 * TODO(M4): fetch GET /api/v1/tracking/{trackingNumber} (server), render status + history,
 * then a client component subscribes to /api/v1/tracking/{tn}/events (EventSource) for live updates,
 * with reconnect + polling fallback. Show ONLY privacy-safe fields.
 */
export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const { trackingNumber } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="text-sm text-brand">
        ← SwiftDrop
      </Link>
      <div className="mt-6">
        <PageHeader title={`Tracking ${trackingNumber}`} description="Live delivery status" />
        <NotImplemented owner="M4" doc="docs/members/M04-parcel-lifecycle-tracking.md" />
      </div>
    </main>
  );
}
