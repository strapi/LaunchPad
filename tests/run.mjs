// `yarn test`: starts Strapi and the website when they are not already running, waits for them,
// runs the dataset and stack checks, then stops what it started. Needs `yarn seed` to have run once.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRAPI = process.env.STRAPI_URL || 'http://localhost:1337';
const SITE = process.env.SITE_URL || 'http://localhost:3000';
const bin = (app, name) => path.join(ROOT, app, 'node_modules', '.bin', name);

const up = async (url) => { try { return (await fetch(url)).status < 500; } catch { return false; } };
const waitFor = async (url, label, ms = 180000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await up(url)) return; await new Promise((r) => setTimeout(r, 2000)); }
  throw new Error(`${label} did not come up on ${url} within ${ms / 1000}s`);
};
const start = (cmd, args, cwd, label) => {
  const child = spawn(cmd, args, { cwd, detached: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '0' } });
  child.stdout.on('data', (d) => { if (process.env.TEST_VERBOSE) process.stdout.write(`[${label}] ${d}`); });
  child.stderr.on('data', (d) => { if (process.env.TEST_VERBOSE) process.stderr.write(`[${label}] ${d}`); });
  return child;
};

const started = [];
const stop = () => { for (const c of started) { try { process.kill(-c.pid, 'SIGTERM'); } catch { try { c.kill('SIGTERM'); } catch {} } } };
process.on('SIGINT', () => { stop(); process.exit(130); });

let code = 1;
try {
  if (!(await up(`${STRAPI}/_health`))) {
    console.log('[test] starting Strapi (strapi develop)');
    started.push(start(bin('strapi', 'strapi'), ['develop'], path.join(ROOT, 'strapi'), 'strapi'));
  } else console.log(`[test] using the Strapi already running on ${STRAPI}`);
  if (!(await up(`${SITE}/en`))) {
    console.log('[test] starting the website (next dev)');
    started.push(start(bin('next', 'next'), ['dev'], path.join(ROOT, 'next'), 'next'));
  } else console.log(`[test] using the website already running on ${SITE}`);
  await waitFor(`${STRAPI}/_health`, 'Strapi');
  await waitFor(`${SITE}/en`, 'the website');
  console.log('[test] both up, running the checks');
  code = await new Promise((resolve) => {
    const t = spawn(process.execPath, ['--test', path.join(ROOT, 'tests', 'dataset.test.mjs'), path.join(ROOT, 'tests', 'stack.test.mjs')], { stdio: 'inherit' });
    t.on('exit', (c) => resolve(c ?? 1));
  });
} catch (e) {
  console.error(`[test] ${e.message}`);
} finally {
  if (started.length) { console.log('[test] stopping what was started'); stop(); }
}
process.exit(code);
