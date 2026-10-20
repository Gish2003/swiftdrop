/**
 * User roles. MUST stay identical to the `Role` enum in packages/db/prisma/schema/auth.prisma
 * (a parity test in apps/api enforces this). Owner: M2.
 */
export const ROLES = ['CUSTOMER', 'MERCHANT', 'COURIER', 'DISPATCHER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

/** Landing route in the web app for each role after sign-in. */
export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/customer',
  MERCHANT: '/merchant',
  COURIER: '/courier',
  DISPATCHER: '/dispatch',
  ADMIN: '/admin',
};
