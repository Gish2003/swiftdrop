import type { ParcelStatus } from '@swiftdrop/contracts';
import { cn } from './cn';

const styles: Record<ParcelStatus, string> = {
  CREATED: 'bg-slate-100 text-slate-700',
  PICKED_UP: 'bg-indigo-100 text-indigo-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-700',
};

export const STATUS_LABEL: Record<ParcelStatus, string> = {
  CREATED: 'Created',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  FAILED: 'Delivery failed',
};

export function StatusBadge({ status }: { status: ParcelStatus }) {
  return (
    <span
      className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
