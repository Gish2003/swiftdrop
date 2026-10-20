export interface NavItem {
  href: string;
  label: string;
  /** Member who owns the page (for humans/agents reading the config). */
  owner: string;
}
