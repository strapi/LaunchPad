//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Rule overrides merged into every config object that already declares rules,
 * so the plugins stay defined alongside the rules they belong to.
 */
const overrides = {
  // Strapi responses are typed optimistically, but a CMS entry can always come
  // back with a missing relation, component or media field. The defensive `?.`
  // and fallback checks throughout the components are deliberate, so flag them
  // rather than fail the build on them.
  '@typescript-eslint/no-unnecessary-condition': 'warn',
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Build artifacts. Without this ESLint tries to type-check the emitted
    // bundles, which aren't in any tsconfig project and fail to parse.
    ignores: [
      '.output/**',
      '.nitro/**',
      '.tanstack/**',
      'dist/**',
      'src/routeTree.gen.ts',
    ],
  },
  ...tanstackConfig.map((config) =>
    config.rules
      ? { ...config, rules: { ...config.rules, ...overrides } }
      : config
  ),
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // Several of the animation effects intentionally run once on mount;
      // adding the suggested dependencies would restart them on every render.
      // Kept on so the rule stays visible (and so the inline
      // `eslint-disable-next-line` comments in the components resolve).
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    // `useAppSession()` is TanStack Start's server-side session helper, not a
    // React hook — it only shares the `use` prefix. rules-of-hooks can't tell
    // the difference, so it's off for the server-only modules that call it.
    files: ['src/lib/session.ts', 'src/data/server-functions/**/*.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
