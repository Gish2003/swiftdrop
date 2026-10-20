// Shared ESLint flat config for the whole monorepo. Owner: M1 (changes via PR review).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import nextVitals from 'eslint-config-next/core-web-vitals';

const WEB = ['apps/web/**/*.{ts,tsx,js,jsx}'];

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      'packages/db/generated/**',
      'apps/web/src/lib/api/schema.d.ts',
      'apps/web/next-env.d.ts',
      '**/playwright-report/**',
      'apps/api/.openapi/**',
      'apps/api/openapi.json',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Module boundary rule: API modules may only import another module through its index.ts
    files: ['apps/api/src/modules/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // '../parcels/parcels.service' or '../../parcels/dto/x' → deep import into another module
              regex:
                '^\\.\\./(?!\\.\\.)[^/]+/.+|^\\.\\./\\.\\./(?!\\.\\.|common/|infra/|config/)[^/]+/.+',
              message:
                "Import another module only through its public index.ts (e.g. '../parcels'). See AGENTS.md > Module boundaries.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/test/**/*.ts', 'apps/e2e/**/*.ts'],
    languageOptions: { globals: { ...globals.jest } },
    rules: { '@typescript-eslint/no-explicit-any': 'off', 'no-restricted-imports': 'off' },
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  // Next.js rules (react, react-hooks, a11y, next) — scoped to the web app only
  ...nextVitals.map((c) => ({ ...c, files: WEB })),
  {
    files: WEB,
    languageOptions: { globals: { ...globals.browser } },
    settings: { next: { rootDir: 'apps/web' } },
  },
  prettier,
);
