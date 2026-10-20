import type { NavItem } from './types';

export const dispatchNav: NavItem[] = [
  { href: '/dispatch', label: 'Unassigned', owner: 'M7' },
  { href: '/dispatch/couriers', label: 'Courier workload', owner: 'M7' },
  { href: '/admin/zones', label: 'Zones', owner: 'M7' },
  { href: '/admin/pricing', label: 'Pricing', owner: 'M7' },
  { href: '/admin/reports', label: 'Reports', owner: 'M9' },
];
