import { cn } from './cn';

const tones = {
  info: 'border-brand-soft bg-brand-soft/40 text-brand-dark',
  success: 'border-green-200 bg-green-50 text-success',
  warning: 'border-amber-200 bg-amber-50 text-warning',
  error: 'border-red-200 bg-red-50 text-danger',
};

export function Alert({
  tone = 'info',
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-md border px-4 py-3 text-sm', tones[tone])} role="status">
      {children}
    </div>
  );
}
