import * as fs from 'fs';
import * as path from 'path';

import { rootDir } from './paths.mjs';

/**
 * Every frontend LaunchPad ships, whether or not it is checked out.
 *
 * `strapiUrlKey` differs per framework because Next requires the
 * `NEXT_PUBLIC_` prefix and Vite requires `VITE_` for a variable to reach
 * the browser. That is framework policy, not inconsistency.
 */
export interface Frontend {
  name: string;
  label: string;
  dir: string;
  port: number;
  strapiUrlKey: string;
}

const define = (
  name: string,
  label: string,
  port: number,
  strapiUrlKey: string,
): Frontend => ({
  name,
  label,
  dir: path.join(rootDir, name),
  port,
  strapiUrlKey,
});

export const FRONTENDS: Frontend[] = [
  define('next', 'Next.js', 3000, 'NEXT_PUBLIC_API_URL'),
  define('astro', 'Astro', 4321, 'STRAPI_URL'),
  define('nuxt', 'Nuxt 4', 3001, 'STRAPI_URL'),
  define('tanstack', 'TanStack Start', 3002, 'VITE_STRAPI_URL'),
];

/**
 * Frontends actually checked out. The registry lists all four so the
 * scripts are complete from the first commit, but a framework that has
 * not landed yet must not break setup, dev, or the env check.
 */
export function presentFrontends(): Frontend[] {
  return FRONTENDS.filter((f) =>
    fs.existsSync(path.join(f.dir, 'package.json')),
  );
}

export function getFrontend(name: string): Frontend {
  const found = FRONTENDS.find((f) => f.name === name);
  if (!found) {
    const names = FRONTENDS.map((f) => f.name).join(', ');
    throw new Error(`Unknown frontend "${name}". Expected one of: ${names}`);
  }
  return found;
}

export const frontendUrl = (f: Frontend): string =>
  `http://localhost:${f.port}`;
