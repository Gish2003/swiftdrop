import type { NavItem } from './types';

export const adminNav: NavItem[] = [
  { href: '/admin', label: 'Overview', owner: 'M9' },
  { href: '/admin/users', label: 'Users', owner: 'M2' },
  { href: '/admin/merchants', label: 'Merchants', owner: 'M5' },
  { href: '/dispatch', label: 'Dispatch', owner: 'M7' },
  { href: '/admin/zones', label: 'Zones', owner: 'M7' },
  { href: '/admin/pricing', label: 'Pricing', owner: 'M7' },
  { href: '/admin/reports', label: 'Reports', owner: 'M9' },
  { href: '/admin/audit', label: 'Audit log', owner: 'M9' },
  { href: '/admin/ops', label: 'Event ops', owner: 'M8' },
];
