// Integration / API tests: `test/**/*.e2e-spec.ts`. Need Postgres (swiftdrop_test) — run via `make test-int`.
const swc = require('./swc-jest');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: swc,
  globalSetup: '<rootDir>/test/utils/global-setup.ts',
  setupFiles: ['<rootDir>/test/utils/env.ts'],
  testTimeout: 30000,
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/index.ts'],
  coverageDirectory: 'coverage/integration',
};
