import Link from 'next/link';
import { Card, NotImplemented } from '@/components/ui';

export const metadata = { title: 'Create account' };

/** Owner: M2 — customer registration form (POST /api/v1/auth/register). */
export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="text-lg font-bold text-brand">
        SwiftDrop
      </Link>
      <Card className="mt-6 space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <NotImplemented owner="M2" doc="docs/members/M02-auth-users.md" />
      </Card>
    </main>
  );
}
