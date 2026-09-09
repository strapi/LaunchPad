/**
 * The frontends LaunchPad ships.
 *
 * This mirrors `scripts/frontends.mts` in the LaunchPad repo. Keep the two in
 * step: the ports and dev scripts here have to match what that repo actually
 * runs, or the CLI will check the wrong port and call a script that does not
 * exist.
 *
 * Adding a frontend should be one entry — the prompt, the `--framework`
 * choices, the port check, the dev command and the help text all read from
 * this list.
 */
export const FRAMEWORKS = [
  { name: 'next', label: 'Next.js', port: 3000, devScript: 'dev' },
  { name: 'astro', label: 'Astro', port: 4321, devScript: 'dev:astro' },
  { name: 'nuxt', label: 'Nuxt 4', port: 3001, devScript: 'dev:nuxt' },
  {
    name: 'tanstack',
    label: 'TanStack Start',
    port: 3002,
    devScript: 'dev:tanstack',
  },
];

/** Port Strapi listens on. Shared by every frontend. */
export const STRAPI_PORT = 1337;

/** The frontend used when none is chosen. */
export const DEFAULT_FRAMEWORK = 'next';

export const frameworkNames = () => FRAMEWORKS.map((f) => f.name);

export function getFramework(name) {
  return FRAMEWORKS.find((f) => f.name === name) ?? null;
}
