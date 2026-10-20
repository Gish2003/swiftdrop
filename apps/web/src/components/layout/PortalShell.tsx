import Link from 'next/link';
import type { NavItem } from '@/config/nav/types';
import type { SessionUser } from '@/lib/auth/session';
import { LogoutButton } from './LogoutButton';

/** Shared portal chrome (header + nav). Owner: M1. Each portal's layout.tsx passes its own nav. */
export function PortalShell({
  title,
  nav,
  user,
  children,
}: {
  title: string;
  nav: NavItem[];
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-brand">
              SwiftDrop
            </Link>
            <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted hover:bg-canvas hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
