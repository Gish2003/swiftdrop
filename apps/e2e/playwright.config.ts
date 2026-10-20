import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against the full docker stack through the gateway.
 *   make e2e            (inside docker, base URL http://gateway)
 *   E2E_BASE_URL=http://localhost:8080 pnpm --filter @swiftdrop/e2e test:e2e   (from host)
 * Owner: M10. Each journey owner adds specs under tests/<journey>.spec.ts.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // couriers use phones — keep the courier journeys green on mobile too
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
});
