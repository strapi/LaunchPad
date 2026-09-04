import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import {
  Frontend,
  frontendUrl,
  getFrontend,
  presentFrontends,
} from './frontends.mjs';
import { backendDir, rootDir } from './paths.mjs';

/**
 * Environment files for Strapi and every frontend.
 *
 * Some values belong to exactly one app (APP_KEYS, ADMIN_JWT_SECRET) and
 * some are a contract across all of them (PREVIEW_SECRET). Copying a
 * contract value into five files and hoping they stay equal is how preview
 * mode quietly breaks: Strapi signs a preview URL with one secret, the
 * frontend validates with another, and all you see is a 401.
 *
 * With one backend and several frontends there is an obvious owner, so
 * strapi/.env holds the value and setup pushes it outward.
 */

// Case-insensitive on purpose. The shipped .env.example writes
// "tobemodified", but .env files in the wild contain "toBeModified", and a
// case-sensitive replace silently leaves those in place — which is how a
// live backend ends up running on a published placeholder secret.
const PLACEHOLDER = /tobemodified/gi;
const PREVIEW_PLACEHOLDER = 'preview_secret';

export const generateSecret = (): string =>
  crypto.randomUUID().replace(/-/g, '_');

export const envPathFor = (dir: string): string => path.join(dir, '.env');

export function readEnvValue(file: string, key: string): string | null {
  let text: string;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  const match = new RegExp(`^${key}=(.*)$`, 'm').exec(text);
  if (!match) return null;
  // dotenv strips unquoted trailing comments and surrounding quotes.
  return match[1]
    .replace(/\s+#.*$/, '')
    .trim()
    .replace(/^["']|["']$/g, '');
}

export function writeEnvValue(file: string, key: string, value: string): void {
  const text = fs.readFileSync(file, 'utf8');
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  const next = pattern.test(text)
    ? text.replace(pattern, `${key}=${value}`)
    : `${text.replace(/\n*$/, '\n')}${key}=${value}\n`;
  fs.writeFileSync(file, next, 'utf8');
}

/**
 * Creates `<dir>/.env` from `<dir>/.env.example` if it does not exist,
 * replacing every `tobemodified` with its own freshly generated secret.
 * Never overwrites an existing `.env`.
 */
export function ensureEnvFile(dir: string, label: string): boolean {
  const examplePath = path.join(dir, '.env.example');
  const envPath = envPathFor(dir);

  if (!fs.existsSync(examplePath)) {
    throw new Error(`${label}: no .env.example found at ${examplePath}`);
  }

  if (fs.existsSync(envPath)) {
    console.log(`  ${label}: .env already exists, leaving it alone`);
    return false;
  }

  const contents = fs
    .readFileSync(examplePath, 'utf8')
    // A function replacement runs per match, so each placeholder gets a
    // distinct secret rather than all of them sharing one.
    .replace(PLACEHOLDER, generateSecret);

  fs.writeFileSync(envPath, contents, 'utf8');
  console.log(`  ${label}: created .env from .env.example`);
  return true;
}

const isReal = (value: string | null): value is string =>
  !!value &&
  value.toLowerCase() !== PREVIEW_PLACEHOLDER &&
  !value.toLowerCase().includes('tobemodified');

/**
 * Pushes strapi/.env's PREVIEW_SECRET out to every present frontend.
 *
 * Strapi owns the value because it is the one signing preview URLs. If it
 * still holds the placeholder, a real secret is minted once and stored
 * there first.
 */
export function propagatePreviewSecret(): string {
  const backendEnv = envPathFor(backendDir);
  let secret = readEnvValue(backendEnv, 'PREVIEW_SECRET');

  if (!isReal(secret)) {
    secret = generateSecret();
    writeEnvValue(backendEnv, 'PREVIEW_SECRET', secret);
    console.log('  PREVIEW_SECRET: generated a new value in strapi/.env');
  }

  for (const f of presentFrontends()) {
    const envPath = envPathFor(f.dir);
    if (!fs.existsSync(envPath)) continue;
    if (readEnvValue(envPath, 'PREVIEW_SECRET') === secret) continue;
    writeEnvValue(envPath, 'PREVIEW_SECRET', secret);
    console.log(`  PREVIEW_SECRET: synced into ${f.name}/.env`);
  }

  return secret;
}

/** The frontend the Strapi admin's Preview button currently opens. */
export function currentPreviewTarget(): string | null {
  return readEnvValue(envPathFor(backendDir), 'CLIENT_URL');
}

/**
 * Points Strapi's CLIENT_URL at one frontend.
 *
 * Strapi's preview handler must return a single URL, so exactly one
 * frontend can be the Preview button's target at a time. Note that Strapi
 * reads this at boot — callers are responsible for warning if it is
 * already running.
 */
export function setPreviewTarget(name: string): string {
  const frontend: Frontend = getFrontend(name);
  const url = frontendUrl(frontend);
  writeEnvValue(envPathFor(backendDir), 'CLIENT_URL', url);
  return url;
}

export interface CheckResult {
  ok: boolean;
  problems: string[];
}

export function checkEnv(): CheckResult {
  const problems: string[] = [];
  const backendEnv = envPathFor(backendDir);

  if (!fs.existsSync(backendEnv)) {
    return {
      ok: false,
      problems: ['strapi/.env is missing — run `yarn setup`'],
    };
  }

  for (const key of ['PREVIEW_SECRET', 'APP_KEYS', 'ADMIN_JWT_SECRET']) {
    const value = readEnvValue(backendEnv, key);
    if (!value) {
      problems.push(`strapi/.env: ${key} is missing or empty`);
    } else if (!isReal(value)) {
      problems.push(
        `strapi/.env: ${key} is still the placeholder "${value}" — replace it with a real value`,
      );
    }
  }

  const backendPreview = readEnvValue(backendEnv, 'PREVIEW_SECRET');
  const present = presentFrontends();

  for (const f of present) {
    const envPath = envPathFor(f.dir);
    if (!fs.existsSync(envPath)) {
      problems.push(`${f.name}/.env is missing — run \`yarn setup\``);
      continue;
    }

    const strapiUrl = readEnvValue(envPath, f.strapiUrlKey);
    if (!strapiUrl) {
      problems.push(`${f.name}/.env: ${f.strapiUrlKey} is missing or empty`);
    }

    const preview = readEnvValue(envPath, 'PREVIEW_SECRET');
    if (!preview) {
      problems.push(`${f.name}/.env: PREVIEW_SECRET is missing or empty`);
    } else if (backendPreview && preview !== backendPreview) {
      problems.push(
        `${f.name}/.env: PREVIEW_SECRET differs from strapi/.env — Strapi will sign preview URLs this frontend rejects with 401. Run \`yarn setup\` to sync them.`,
      );
    }

    // Too short a key makes scrypt derivation trivially brute-forceable.
    const session = readEnvValue(envPath, 'SESSION_SECRET');
    if (session && session.length < 32) {
      problems.push(
        `${f.name}/.env: SESSION_SECRET must be at least 32 characters (currently ${session.length})`,
      );
    }
  }

  // CLIENT_URL must name a frontend that is actually checked out.
  const clientUrl = readEnvValue(backendEnv, 'CLIENT_URL');
  if (clientUrl && !present.some((f) => frontendUrl(f) === clientUrl)) {
    const known = present.map((f) => `${f.name} (${frontendUrl(f)})`).join(', ');
    problems.push(
      `strapi/.env: CLIENT_URL is ${clientUrl}, which is not a checked-out frontend. Known: ${known}. Run \`yarn use <framework>\`.`,
    );
  }

  return { ok: problems.length === 0, problems };
}

export function reportCheck(result: CheckResult): void {
  if (result.ok) {
    console.log('✓ Environment looks consistent.');
    return;
  }
  console.error('\n✖ Environment problems:\n');
  for (const problem of result.problems) console.error(`  • ${problem}`);
  console.error(
    `\nChecked against ${path.relative(process.cwd(), rootDir) || '.'}\n`,
  );
}
