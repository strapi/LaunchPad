import {
  checkEnv,
  ensureEnvFile,
  propagatePreviewSecret,
  reportCheck,
} from './env.mjs';
import { presentFrontends } from './frontends.mjs';
import { backendDir } from './paths.mjs';
import { run } from './run.mjs';

/**
 * Installs dependencies and creates .env files for Strapi and every
 * frontend that is checked out. Safe to re-run: existing .env files are
 * left alone, and the shared PREVIEW_SECRET is preserved rather than
 * regenerated, so a secret already configured in the Strapi admin keeps
 * working.
 */

console.log('\nInstalling Strapi dependencies...');
await run('yarn', ['install'], { cwd: backendDir });
ensureEnvFile(backendDir, 'strapi');

for (const f of presentFrontends()) {
  console.log(`\nInstalling ${f.label} dependencies...`);
  await run('yarn', ['install'], { cwd: f.dir });
  ensureEnvFile(f.dir, f.name);
}

console.log('\nReconciling shared secrets...');
propagatePreviewSecret();

const result = checkEnv();
reportCheck(result);

if (!result.ok) {
  console.error(
    'Setup finished but the environment is inconsistent (see above).'
  );
  process.exit(1);
}

console.log(`
Ready. Frontends checked out: ${presentFrontends()
  .map((f) => f.name)
  .join(', ')}

  yarn seed              import the demo content
  yarn dev               Strapi + Next      (default)
  yarn dev:astro         Strapi + Astro
  yarn dev:nuxt          Strapi + Nuxt
  yarn dev:tanstack      Strapi + TanStack
  yarn use <framework>   set the admin Preview button's target
`);
