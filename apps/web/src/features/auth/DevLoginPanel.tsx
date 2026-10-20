'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';

interface DevUser {
  email: string;
  name: string;
  role: string;
}

/**
 * DEV ONLY (NEXT_PUBLIC_ENABLE_DEV_LOGIN=true): one-click sign-in as any seeded account.
 * Lets everyone build their portal before real auth lands. Owner: M1. Remove before the final demo.
 */
export function DevLoginPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<DevUser[]>([]);

  useEffect(() => {
    fetch('/api/v1/dev/users', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  async function loginAs(email: string) {
    const res = await fetch('/api/v1/dev/login-as', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const { home } = (await res.json()) as { home: string };
      router.push(home);
      router.refresh();
    }
  }

  if (!users.length) return null;
  return (
    <Card className="mt-6 border-dashed" data-testid="dev-login">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-warning">Dev login</p>
      <div className="grid gap-2">
        {users.map((u) => (
          <Button
            key={u.email}
            variant="secondary"
            onClick={() => loginAs(u.email)}
            className="justify-between"
          >
            <span>{u.name}</span>
            <span className="text-xs text-muted">{u.role}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
