import {
  checkEnv,
  readEnvValue,
  reportCheck,
  setPreviewTarget,
} from './env.mjs';
import { getFrontend } from './frontends.mjs';
import { backendDir } from './paths.mjs';
import { run } from './run.mjs';

/**
 * Starts Strapi, waits for its health check, then starts one frontend.
 * Stopping either stops the other.
 *
 * The frontend waits for Strapi because every page fetches content
 * server-side on first render, so a frontend that booted first would serve
 * errors until the backend caught up.
 *
 * The preview target is set before Strapi boots. This is the one place it
 * can be done without ambiguity, because this command owns the Strapi
 * process and Strapi reads CLIENT_URL only at startup.
 */

const name = process.argv[2]?.trim();
if (!name) {
  console.error('Usage: dev.mts <framework>');
  process.exit(1);
}

const frontend = getFrontend(name);

const result = checkEnv();
if (!result.ok) {
  reportCheck(result);
  throw new Error('Refusing to start with an inconsistent environment.');
}

const url = setPreviewTarget(frontend.name);
const strapiPort = readEnvValue(`${backendDir}/.env`, 'PORT') ?? '1337';

console.log(
  `\nStarting Strapi on :${strapiPort} and ${frontend.label} on :${frontend.port}`
);
console.log(`Preview target: ${url}\n`);

await run('yarn', [
  'concurrently',
  '--kill-others',
  '--names',
  `strapi,${frontend.name}`,
  '--prefix-colors',
  'magenta,green',
  'cd strapi && yarn develop',
  `npx wait-on http://localhost:${strapiPort}/_health && cd ${frontend.name} && yarn dev`,
]);
