# Multi-Framework LaunchPad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Astro, Nuxt, and TanStack Start ports into this repository so all four frontends share one Strapi backend and one git history.

**Architecture:** A frontend registry (`scripts/frontends.mts`) declares all four frontends and tolerates ones not yet present on disk. Every orchestration script reads that registry, so adding a framework is a directory plus a registry entry. `strapi/.env` becomes the source of truth for `PREVIEW_SECRET`; `CLIENT_URL` becomes the switchable preview target.

**Tech Stack:** Node 24, Yarn 4.5.0, TypeScript via `tsx`, Strapi 5.50, Next 15, Astro, Nuxt 4, TanStack Start.

**Spec:** `.claude/specs/2026-09-03-multi-framework-monorepo-design.md`

## Global Constraints

- **Nothing merges into `main`.** All work lands on branches.
- **Nothing is pushed to `strapi/LaunchPad` until all three frameworks are integrated.** Then one draft PR.
- **Each unit of work gets its own branch.** Branches stack in the order below.
- **Next.js stays the default.** A fresh clone must behave exactly as it does today: `yarn dev` starts Strapi + Next.
- **Ports:** Strapi `1337`, Next `3000`, Nuxt `3001`, TanStack `3002` (was 3000), Astro `4321`.
- **`strapi/.env` is the source of truth for `PREVIEW_SECRET`.**
- **No Yarn workspaces.** Each directory keeps its own lockfile, matching `next/` and `strapi/` today.
- **Do not commit `strapi/package.json`.** It carries a pre-existing local Strapi UUID stamp that is not part of this work.

### Per-frontend facts (do not guess these)

| Frontend | Dir | Port | Strapi URL key | Extra secrets |
|---|---|---|---|---|
| Next | `next/` | 3000 | `NEXT_PUBLIC_API_URL` | — |
| Astro | `astro/` | 4321 | `STRAPI_URL` | `SESSION_SECRET` |
| Nuxt | `nuxt/` | 3001 | `STRAPI_URL` | `SESSION_SECRET` |
| TanStack | `tanstack/` | 3002 | `VITE_STRAPI_URL` | `SESSION_SECRET`, `REVALIDATE_SECRET` |

The Strapi URL key differs by framework because Next requires the
`NEXT_PUBLIC_` prefix and Vite requires `VITE_`. This is not
inconsistency to be normalized away.

## A note on testing

This repository has **no test infrastructure** — no test runner, and no
`test` script in any `package.json`. Inventing one is out of scope.

These tasks are orchestration scripts, so the red/green cycle uses
executable verification commands instead: run the command, observe the
specific failure, implement, run it again, observe the specific success.
Every task below states the exact command and the exact expected output
for both states. Do not skip the "observe it fail" step — it is what
proves the check is real.

## File structure

**Created on the groundwork branch:**

| File | Responsibility |
|---|---|
| `scripts/frontends.mts` | The registry. Declares all four frontends, filters to those present on disk. |
| `scripts/env.mts` | Read/write `.env` values, generate secrets, reconcile `PREVIEW_SECRET`, validate. |
| `scripts/paths.mts` | Repo-root resolution shared by the other scripts. |
| `scripts/setup.mts` | Install deps and create `.env` files for Strapi and every present frontend. |
| `scripts/dev.mts` | Start Strapi plus one named frontend. |
| `scripts/use.mts` | Set or print the preview target. |
| `scripts/check-env.mts` | Report environment consistency. |

**Modified on the groundwork branch:**

| File | Change |
|---|---|
| `package.json` | New scripts; add `tsx`; drop `setup:next`/`setup:strapi`. |
| `strapi/config/admin.ts` | `allowedOrigins` lists all four frontends. |
| `strapi/config/env/production/admin.ts` | Same change. |
| `AGENTS.md` | Rewrite for four frontends. |
| `README.md` | Rewrite for four frontends. |
| `scripts/copy-env.mts` | Deleted — superseded by `scripts/env.mts`. |

**Created on framework branches:** `astro/`, `nuxt/`, `tanstack/`.

### Why `tsx` replaces `ts-node`

Root scripts currently run `node --loader ts-node/esm`. That flag is
deprecated and warns on Node 24, which is what this repo runs. All three
ports already use `node --import tsx`. The groundwork branch adopts `tsx`
for consistency and to remove the deprecation warning.

---

## Branch: `chore/multi-framework-groundwork`

Cut from `docs/multi-framework-integration-spec`.

```bash
git checkout docs/multi-framework-integration-spec
git checkout -b chore/multi-framework-groundwork
```

---

### Task 1: Frontend registry

**Files:**
- Create: `scripts/paths.mts`
- Create: `scripts/frontends.mts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `rootDir: string`, `backendDir: string` (from `paths.mts`)
  - `interface Frontend { name: string; label: string; dir: string; port: number; strapiUrlKey: string }`
  - `FRONTENDS: Frontend[]` — all four, declaration order next, astro, nuxt, tanstack
  - `presentFrontends(): Frontend[]` — those with a `package.json` on disk
  - `getFrontend(name: string): Frontend` — throws listing valid names
  - `frontendUrl(f: Frontend): string` — `http://localhost:<port>`

- [ ] **Step 1: Write the verification command and watch it fail**

```bash
node --import tsx -e "import('./scripts/frontends.mts').then(m => console.log(m.presentFrontends().map(f => f.name)))"
```

Expected: FAIL with `Cannot find module` — the file does not exist yet.

- [ ] **Step 2: Create `scripts/paths.mts`**

```ts
import * as path from 'path';
import { fileURLToPath } from 'url';

/** Repo root, resolved from this file's location rather than cwd. */
export const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

export const backendDir = path.join(rootDir, 'strapi');
```

- [ ] **Step 3: Create `scripts/frontends.mts`**

```ts
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
```

- [ ] **Step 4: Add `tsx` and run the verification command again**

```bash
yarn add -D tsx
node --import tsx -e "import('./scripts/frontends.mts').then(m => console.log(m.presentFrontends().map(f => f.name)))"
```

Expected: PASS, printing exactly `[ 'next' ]` — only Next is checked out at this point. If it prints all four, `presentFrontends` is not filtering.

- [ ] **Step 5: Verify the unknown-name error is useful**

```bash
node --import tsx -e "import('./scripts/frontends.mts').then(m => { try { m.getFrontend('svelte') } catch (e) { console.log(e.message) } })"
```

Expected: `Unknown frontend "svelte". Expected one of: next, astro, nuxt, tanstack`

- [ ] **Step 6: Commit**

```bash
git add scripts/paths.mts scripts/frontends.mts package.json yarn.lock
git commit -m "feat(scripts): add frontend registry

Declares all four frontends with their ports and framework-mandated
Strapi URL keys. presentFrontends() filters to what is checked out, so
the registry can be complete before the directories land."
```

---

### Task 2: Environment module

**Files:**
- Create: `scripts/env.mts`

**Interfaces:**
- Consumes: `backendDir` (paths), `Frontend`, `presentFrontends`, `frontendUrl`, `getFrontend` (frontends)
- Produces:
  - `generateSecret(): string`
  - `readEnvValue(file: string, key: string): string | null`
  - `writeEnvValue(file: string, key: string, value: string): void`
  - `envPathFor(dir: string): string`
  - `ensureEnvFile(dir: string, label: string): boolean`
  - `propagatePreviewSecret(): string`
  - `setPreviewTarget(name: string): string`
  - `currentPreviewTarget(): string | null`
  - `interface CheckResult { ok: boolean; problems: string[] }`
  - `checkEnv(): CheckResult`
  - `reportCheck(result: CheckResult): void`

This is adapted from the ports' `env.mts`. Three changes: `strapi/.env`
is the source of truth for `PREVIEW_SECRET` rather than negotiating with a
single client; the reconcile loops over every present frontend; and
`reconcileClientUrl` becomes the explicit `setPreviewTarget`.

- [ ] **Step 1: Write the verification command and watch it fail**

```bash
node --import tsx ./scripts/check-env.mts
```

Expected: FAIL with `Cannot find module` — neither `env.mts` nor `check-env.mts` exists yet.

- [ ] **Step 2: Create `scripts/env.mts`**

```ts
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

const PLACEHOLDER = /tobemodified/g;
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
  !!value && value !== PREVIEW_PLACEHOLDER && !value.includes('tobemodified');

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
    return { ok: false, problems: ['strapi/.env is missing — run `yarn setup`'] };
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
```

- [ ] **Step 3: Create `scripts/check-env.mts`**

```ts
import { checkEnv, reportCheck } from './env.mjs';

const result = checkEnv();
reportCheck(result);
process.exit(result.ok ? 0 : 1);
```

- [ ] **Step 4: Run the check and confirm it passes for the current repo**

```bash
node --import tsx ./scripts/check-env.mts; echo "exit=$?"
```

Expected: `✓ Environment looks consistent.` and `exit=0`.

If `strapi/.env` or `next/.env` do not exist yet on this machine, the
expected output is instead a specific `... is missing — run \`yarn setup\``
line and `exit=1`. Either is a pass for this step; a stack trace is not.

- [ ] **Step 5: Prove the drift check actually fires**

```bash
cp next/.env /tmp/next.env.bak
node --import tsx -e "import('./scripts/env.mts').then(m => m.writeEnvValue('next/.env','PREVIEW_SECRET','deliberately_wrong'))"
node --import tsx ./scripts/check-env.mts; echo "exit=$?"
cp /tmp/next.env.bak next/.env
```

Expected: a problem line naming `next/.env: PREVIEW_SECRET differs from strapi/.env` and `exit=1`. This is the step that proves the check is real rather than vacuously passing.

- [ ] **Step 6: Commit**

```bash
git add scripts/env.mts scripts/check-env.mts
git commit -m "feat(scripts): multi-frontend environment module

strapi/.env becomes the source of truth for PREVIEW_SECRET and setup
pushes it to every present frontend, replacing the previous negotiation
with a single client. Each frontend is validated against its own
framework-mandated Strapi URL key."
```

---

### Task 3: Setup, dev, and use scripts

**Files:**
- Create: `scripts/setup.mts`
- Create: `scripts/dev.mts`
- Create: `scripts/use.mts`
- Delete: `scripts/copy-env.mts`
- Modify: `package.json`

**Interfaces:**
- Consumes: everything produced by Tasks 1 and 2.
- Produces: the root script surface — `yarn setup`, `yarn dev`, `yarn dev:<fw>`, `yarn use`, `yarn check:env`.

- [ ] **Step 1: Watch the new script surface fail**

```bash
yarn use nuxt
```

Expected: FAIL — `yarn` reports the `use` command does not exist.

- [ ] **Step 2: Create `scripts/use.mts`**

```ts
import * as net from 'net';

import { currentPreviewTarget, setPreviewTarget } from './env.mjs';
import { FRONTENDS, frontendUrl, presentFrontends } from './frontends.mjs';

/** True if something is listening on the port, i.e. Strapi is up. */
function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net
      .connect({ port, host: '127.0.0.1' })
      .on('connect', () => {
        socket.destroy();
        resolve(true);
      })
      .on('error', () => resolve(false));
    socket.setTimeout(300, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const name = process.argv[2]?.trim();

if (!name) {
  const current = currentPreviewTarget();
  const match = FRONTENDS.find((f) => frontendUrl(f) === current);
  console.log(
    `Preview target: ${match ? `${match.name} (${current})` : (current ?? 'not set')}`,
  );
  console.log(
    `Available: ${presentFrontends().map((f) => f.name).join(', ')}`,
  );
  process.exit(0);
}

const url = setPreviewTarget(name);
console.log(`Switched preview target to ${name} (${url})`);

if (await portInUse(1337)) {
  console.log('!  Strapi is running — restart it for this to take effect.');
}
```

- [ ] **Step 3: Create `scripts/setup.mts`**

```ts
import { backendDir } from './paths.mjs';
import { checkEnv, ensureEnvFile, propagatePreviewSecret, reportCheck } from './env.mjs';
import { presentFrontends } from './frontends.mjs';
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
  console.error('Setup finished but the environment is inconsistent (see above).');
  process.exit(1);
}

console.log(`
Ready. Frontends checked out: ${presentFrontends().map((f) => f.name).join(', ')}

  yarn seed              import the demo content
  yarn dev               Strapi + Next      (default)
  yarn dev:astro         Strapi + Astro
  yarn dev:nuxt          Strapi + Nuxt
  yarn dev:tanstack      Strapi + TanStack
  yarn use <framework>   set the admin Preview button's target
`);
```

- [ ] **Step 4: Create `scripts/run.mts`**

```ts
import { spawn } from 'child_process';

/** Runs a command, inheriting stdio, rejecting on a non-zero exit. */
export function run(
  command: string,
  args: string[],
  options: { cwd?: string } = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}
```

- [ ] **Step 5: Create `scripts/dev.mts`**

```ts
import { checkEnv, readEnvValue, reportCheck, setPreviewTarget } from './env.mjs';
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

console.log(`\nStarting Strapi on :${strapiPort} and ${frontend.label} on :${frontend.port}`);
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
```

- [ ] **Step 6: Rewrite the root `package.json` scripts block**

Replace the entire `"scripts"` object with:

```json
  "scripts": {
    "prepare": "husky",
    "setup": "node --import tsx ./scripts/setup.mts",
    "dev": "node --import tsx ./scripts/dev.mts next",
    "dev:astro": "node --import tsx ./scripts/dev.mts astro",
    "dev:nuxt": "node --import tsx ./scripts/dev.mts nuxt",
    "dev:tanstack": "node --import tsx ./scripts/dev.mts tanstack",
    "use": "node --import tsx ./scripts/use.mts",
    "check:env": "node --import tsx ./scripts/check-env.mts",
    "next": "yarn dev --prefix ../next/",
    "strapi": "yarn dev --prefix ../strapi/",
    "seed": "cd strapi && yarn strapi import -f ./data/export_20250116105447.tar.gz --force",
    "export": "cd strapi && yarn strapi export --no-encrypt -f ./data/export_20250116105447",
    "repo:upstream": "git fetch upstream && git merge upstream/main",
    "check:format": "prettier . --check --cache",
    "fix:format": "prettier . --write --cache",
    "fix": "yarn fix:format",
    "lint-staged": "lint-staged"
  },
```

`setup:next` and `setup:strapi` are gone — `setup.mts` covers both and
every other frontend. `seed`, `export`, `check:format`, and the husky
hooks are unchanged.

- [ ] **Step 7: Delete the superseded script**

```bash
git rm scripts/copy-env.mts
```

- [ ] **Step 8: Verify the whole surface works**

```bash
yarn use              # prints current target and available frontends
yarn use next         # switches to next
yarn check:env        # exits 0
```

Expected: `yarn use` prints `Preview target: next (http://localhost:3000)` and `Available: next`. `yarn check:env` prints `✓ Environment looks consistent.`

- [ ] **Step 9: Verify `yarn dev` still starts Strapi + Next**

```bash
yarn dev
```

Expected: Strapi boots on :1337, Next on :3000. In another shell, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en` returns `200`. Stop with Ctrl-C and confirm both processes exit.

This step is the whole point of keeping `yarn dev` unchanged — if it does
not behave exactly as before, stop and fix it before continuing.

- [ ] **Step 10: Commit**

```bash
git add scripts/ package.json yarn.lock
git commit -m "feat(scripts): registry-driven setup, dev, and use

yarn dev keeps its meaning (Strapi + Next). Adds dev:<framework> for each
other frontend and `yarn use` to switch the admin Preview target, warning
when Strapi is running since it reads CLIENT_URL only at boot.

Replaces copy-env.mts and the ts-node loader, which is deprecated on the
Node version this repo targets."
```

---

### Task 4: Strapi allowed origins

**Files:**
- Modify: `strapi/config/admin.ts`
- Modify: `strapi/config/env/production/admin.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks — this is plain Strapi config.
- Produces: `allowedOrigins` accepting all four frontends.

Both files currently read:

```ts
const clientUrl = env('CLIENT_URL');
...
allowedOrigins: [clientUrl],
```

`allowedOrigins` is a one-element array only because there was one
frontend. `CLIENT_URL` keeps selecting which frontend the Preview button
opens; this change only widens which origins are permitted to receive
preview traffic.

- [ ] **Step 1: Confirm the current single-origin behavior**

```bash
grep -n "allowedOrigins" strapi/config/admin.ts strapi/config/env/production/admin.ts
```

Expected: both show `allowedOrigins: [clientUrl],`.

- [ ] **Step 2: Edit `strapi/config/admin.ts`**

Replace the line `const clientUrl = env('CLIENT_URL');` with:

```ts
  const clientUrl = env('CLIENT_URL', 'http://localhost:3000');

  // Every LaunchPad frontend, so preview works whichever one is running.
  // CLIENT_URL still selects which one the admin's Preview button opens;
  // Strapi's preview handler must return a single URL.
  const allowedOrigins = Array.from(
    new Set([
      clientUrl,
      'http://localhost:3000', // next
      'http://localhost:3001', // nuxt
      'http://localhost:3002', // tanstack
      'http://localhost:4321', // astro
    ]),
  );
```

Then replace `allowedOrigins: [clientUrl],` with `allowedOrigins,`.

- [ ] **Step 3: Apply the identical edit to `strapi/config/env/production/admin.ts`**

Repeat Step 2 verbatim in that file. Both files carry the same block
today and must not diverge.

- [ ] **Step 4: Verify Strapi still boots and the config parses**

```bash
cd strapi && yarn develop
```

Expected: `Strapi started successfully` with no config error. Stop it once confirmed.

- [ ] **Step 5: Verify the origins are actually registered**

```bash
node --import tsx -e "
const cfg = (await import('./strapi/config/admin.ts')).default;
const out = cfg({ env: Object.assign((k, d) => process.env[k] ?? d, { bool: (k, d) => d }) });
console.log(out.preview.config.allowedOrigins);
"
```

Expected: an array containing all four localhost origins.

- [ ] **Step 6: Commit**

```bash
git add strapi/config/admin.ts strapi/config/env/production/admin.ts
git commit -m "feat(strapi): allow every LaunchPad frontend as a preview origin

allowedOrigins was a one-element array only because there was one
frontend. CLIENT_URL still selects the Preview button's target, since
Strapi's preview handler returns a single URL."
```

Do **not** `git add strapi/package.json` — it holds a pre-existing local
UUID stamp unrelated to this work.

---

### Task 5: Documentation

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the script surface from Task 3.
- Produces: docs matching the four-frontend shape.

`AGENTS.md` needs particular care. It lists per-directory commands that
agents rely on, and stale entries there cause agents to run commands that
no longer exist — specifically `setup:next` and `setup:strapi`, which
Task 3 removed.

- [ ] **Step 1: Find every stale command reference**

```bash
grep -n "setup:next\|setup:strapi\|copy-env\|ts-node" AGENTS.md README.md
```

Expected: several hits. Every one must be gone by the end of this task.

- [ ] **Step 2: Update `AGENTS.md` — Repo Overview**

Replace the bullet list under `## Repo Overview` with:

```markdown
- `strapi/`: Strapi 5 backend, content types, components, seeded demo data, SQLite default database. Shared by every frontend.
- `next/`: Next.js 15 App Router frontend, React 19, Tailwind, localized `en` and `fr` routes. The default frontend.
- `astro/`: Astro frontend, same content and routes.
- `nuxt/`: Nuxt 4 frontend, same content and routes.
- `tanstack/`: TanStack Start frontend, same content and routes.
- Root: setup/dev/format scripts using Yarn 4.5.0. Each directory keeps its own lockfile; this is not a Yarn workspace.
```

- [ ] **Step 3: Update `AGENTS.md` — Commands**

Replace the list under `## Commands` with:

```markdown
Run commands from the correct directory.

- Root setup: `yarn setup` (installs Strapi and every checked-out frontend)
- Root dev: `yarn dev` (Strapi + Next)
- Other frontends: `yarn dev:astro`, `yarn dev:nuxt`, `yarn dev:tanstack`
- Switch the admin Preview target: `yarn use <framework>`
- Check environment consistency: `yarn check:env`
- Seed Strapi: `yarn seed`
- Format check: `yarn check:format`
- Format fix: `yarn fix:format`
- Strapi dev: `cd strapi && yarn develop`
- Strapi build: `cd strapi && yarn build`
- A frontend directly: `cd <framework> && yarn dev`
```

- [ ] **Step 4: Update `AGENTS.md` — Setup**

Replace the setup block with:

```markdown
Run once after cloning, from the repo root:

```sh
yarn install
yarn setup            # installs strapi/ and every frontend, creates .env files
yarn seed             # imports demo data into SQLite (191 entities, 115 assets)
```

`yarn setup` installs each directory in turn, creates any missing `.env`
from its `.env.example`, and propagates `PREVIEW_SECRET` from `strapi/.env`
to every frontend. It is safe to re-run: existing `.env` files are left
alone and an already-configured preview secret is preserved.

`yarn seed` is destructive — it wipes existing data before importing.
Re-run it to reset to the demo baseline.
```

- [ ] **Step 5: Replace the `## Next Changes` heading**

Change the heading `## Next Changes` to `## Frontend Changes` and add
this paragraph beneath it:

```markdown
All four frontends render the same Strapi content and must stay at
feature parity: the full dynamic-zone block set, blog, products,
CMS-driven pages, `en`/`fr` routing, draft preview, and authentication.
A change to one frontend's rendering usually needs the same change in the
other three.
```

- [ ] **Step 6: Update `README.md` — structure and dev servers**

Under `## 4. Start the Development Servers`, replace the body with:

```markdown
```bash
yarn dev             # Strapi + Next.js   (default)
yarn dev:astro       # Strapi + Astro
yarn dev:nuxt        # Strapi + Nuxt
yarn dev:tanstack    # Strapi + TanStack Start
```

| Frontend | URL |
|---|---|
| Next.js | http://localhost:3000 |
| Nuxt | http://localhost:3001 |
| TanStack Start | http://localhost:3002 |
| Astro | http://localhost:4321 |
| Strapi admin | http://localhost:1337/admin |

### Preview mode

The Strapi admin's Preview button opens one frontend at a time, because
Strapi's preview handler returns a single URL. Choose which:

```bash
yarn use nuxt        # Preview button now opens Nuxt
yarn use             # show the current target
```

`yarn dev:<framework>` sets this for you. Strapi reads the value at
startup, so switching while it runs requires a restart.
```

- [ ] **Step 7: Confirm no stale references remain**

```bash
grep -n "setup:next\|setup:strapi\|copy-env\|ts-node" AGENTS.md README.md; echo "exit=$?"
```

Expected: no output and `exit=1` (grep found nothing).

- [ ] **Step 8: Format and commit**

```bash
yarn fix:format
git add AGENTS.md README.md
git commit -m "docs: describe the four-frontend structure

AGENTS.md listed setup:next and setup:strapi, which no longer exist;
agents following it would run commands that fail. Both files now cover
the frontend set, the dev scripts, and preview target switching."
```

---

## Branch: `feat/astro-frontend`

```bash
git checkout -b feat/astro-frontend
```

---

### Task 6: Astro frontend

**Files:**
- Create: `astro/` (contents of the Astro port's `client/`)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `presentFrontends()` picks `astro/` up automatically once `astro/package.json` exists. No registry edit is needed — Task 1 already declared it.
- Produces: a working `yarn dev:astro`.

- [ ] **Step 1: Confirm Astro is not yet visible to the scripts**

```bash
yarn use
```

Expected: `Available: next` — Astro is declared in the registry but not on disk.

- [ ] **Step 2: Copy the application, excluding build artifacts**

```bash
rsync -a \
  --exclude node_modules --exclude .yarn --exclude dist \
  --exclude .astro --exclude .env --exclude '.env.bak*' \
  ../astro/client/ astro/
```

`.env` is excluded because it is machine-local and gitignored; `yarn setup`
recreates it from `.env.example`. `.yarn/` is excluded because the root
already pins Yarn 4.5.0.

- [ ] **Step 3: Verify exactly what arrived**

```bash
ls -A astro/
```

Expected: `.env.example .yarnrc.yml astro.config.mjs package.json src tsconfig.json yarn.lock`

If `node_modules`, `dist`, `.astro`, or any `.env*` besides `.env.example`
appears, the exclusions did not apply — delete `astro/` and redo Step 2.

- [ ] **Step 4: Name the package after its directory**

The port's `package.json` has `"name": "client"`, which is meaningless
here. Change it:

```bash
node --import tsx -e "
import * as fs from 'fs';
const p = 'astro/package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.name = 'launchpad-astro';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
```

- [ ] **Step 5: Confirm the registry now sees it**

```bash
yarn use
```

Expected: `Available: next, astro`

- [ ] **Step 6: Set up and check the environment**

```bash
yarn setup
```

Expected: Astro dependencies install, `astro/.env` is created from
`.env.example`, `PREVIEW_SECRET: synced into astro/.env`, and the run ends
with `✓ Environment looks consistent.`

- [ ] **Step 7: Run the verification gate**

```bash
yarn dev:astro
```

Then in another shell:

```bash
for p in /en /fr /en/blog /en/products; do
  printf "%-14s %s bytes=%s\n" "$p" \
    "$(curl -s -o /tmp/p.html -w '%{http_code}' http://localhost:4321$p)" \
    "$(wc -c < /tmp/p.html)"
done
```

Expected: all four return `200` with tens of kilobytes each. A 200 with a
few hundred bytes means the frontend booted but lost its Strapi
connection — that is a failure, not a pass.

- [ ] **Step 8: Verify a detail page renders real content**

```bash
SLUG=$(curl -s http://localhost:4321/en/blog | grep -oE '/en/blog/[a-z0-9-]+' | sort -u | head -1)
curl -s "http://localhost:4321$SLUG" | grep -o '<h1[^>]*>[^<]*' | head -1
```

Expected: an `<h1>` containing the article's real title, not the site name.

- [ ] **Step 9: Verify the production build**

```bash
cd astro && yarn build && cd ..
```

Expected: build completes with no error.

- [ ] **Step 10: Verify the Preview button target**

```bash
yarn use astro
```

Expected: `Switched preview target to astro (http://localhost:4321)` plus
the running-Strapi warning if it is up. Restart Strapi, open
http://localhost:1337/admin, edit an article, and confirm Preview opens
`localhost:4321`.

- [ ] **Step 11: Confirm build artifacts are ignored**

```bash
git status --porcelain astro/ | grep -E "node_modules|dist|\.astro/|\.env$" ; echo "exit=$?"
```

Expected: no output, `exit=1`. If anything appears, add the pattern to
`.gitignore` before committing.

- [ ] **Step 12: Format and commit**

```bash
yarn fix:format
git add astro/ .gitignore
git commit -m "feat(astro): add the Astro frontend

Ports the standalone Astro LaunchPad into the monorepo. The port's
backend-fetching scripts are dropped: strapi/ is a sibling here, so the
frontend registry and root scripts cover what they did."
```

---

## Branch: `feat/nuxt-frontend`

```bash
git checkout -b feat/nuxt-frontend
```

---

### Task 7: Nuxt frontend

**Files:**
- Create: `nuxt/` (contents of the Nuxt port's `client/`)

**Interfaces:**
- Consumes: `presentFrontends()`, exactly as Task 6.
- Produces: a working `yarn dev:nuxt`.

- [ ] **Step 1: Copy the application, excluding build artifacts**

```bash
rsync -a \
  --exclude node_modules --exclude .yarn --exclude .output \
  --exclude .nuxt --exclude .env --exclude '.env.bak*' \
  ../nuxt/client/ nuxt/
```

The `--exclude '.env.bak*'` matters here specifically: the Nuxt port
contains a `.env.bak-1337` left over from a port reassignment. It must not
travel into the repository.

- [ ] **Step 2: Verify exactly what arrived**

```bash
ls -A nuxt/
```

Expected: `.env.example .yarnrc.yml app nuxt.config.ts package.json public server shared tsconfig.json yarn.lock`

Confirm no `.env.bak-1337`. If it appears, delete it before continuing.

- [ ] **Step 3: Name the package after its directory**

```bash
node --import tsx -e "
import * as fs from 'fs';
const p = 'nuxt/package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.name = 'launchpad-nuxt';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
```

- [ ] **Step 4: Confirm the registry sees it, then set up**

```bash
yarn use          # expect: Available: next, astro, nuxt
yarn setup
```

Expected: Nuxt dependencies install, `nuxt/.env` created,
`PREVIEW_SECRET: synced into nuxt/.env`, ending `✓ Environment looks consistent.`

- [ ] **Step 5: Confirm the port is 3001, not 3000**

```bash
grep '^PORT=' nuxt/.env
```

Expected: `PORT=3001`. If it says 3000, the wrong `.env.example` was
copied and it will collide with Next.

- [ ] **Step 6: Run the verification gate**

```bash
yarn dev:nuxt
```

Then in another shell:

```bash
for p in /en /fr /en/blog /en/products; do
  printf "%-14s %s bytes=%s\n" "$p" \
    "$(curl -s -o /tmp/p.html -w '%{http_code}' http://localhost:3001$p)" \
    "$(wc -c < /tmp/p.html)"
done
```

Expected: all four `200` with tens of kilobytes each.

- [ ] **Step 7: Verify a detail page renders real content**

```bash
SLUG=$(curl -s http://localhost:3001/en/blog | grep -oE '/en/blog/[a-z0-9-]+' | sort -u | head -1)
curl -s "http://localhost:3001$SLUG" | grep -o '<h1[^>]*>[^<]*' | head -1
```

Expected: an `<h1>` containing the article's real title.

- [ ] **Step 8: Verify the production build**

```bash
cd nuxt && yarn build && cd ..
```

Expected: build completes with no error.

- [ ] **Step 9: Verify the Preview button target**

```bash
yarn use nuxt
```

Expected: `Switched preview target to nuxt (http://localhost:3001)`.
Restart Strapi and confirm Preview opens `localhost:3001`.

- [ ] **Step 10: Confirm build artifacts are ignored**

```bash
git status --porcelain nuxt/ | grep -E "node_modules|\.output|\.nuxt/|\.env$" ; echo "exit=$?"
```

Expected: no output, `exit=1`.

- [ ] **Step 11: Format and commit**

```bash
yarn fix:format
git add nuxt/ .gitignore
git commit -m "feat(nuxt): add the Nuxt 4 frontend

Ports the standalone Nuxt LaunchPad into the monorepo on port 3001, so it
does not collide with Next on 3000."
```

---

## Branch: `feat/tanstack-frontend`

```bash
git checkout -b feat/tanstack-frontend
```

---

### Task 8: TanStack frontend

**Files:**
- Create: `tanstack/` (contents of the TanStack port's `client/`)

**Interfaces:**
- Consumes: `presentFrontends()`, exactly as Tasks 6 and 7.
- Produces: a working `yarn dev:tanstack`.

This is the only frontend whose port changes. It ran on 3000 standalone,
which belongs to Next here.

- [ ] **Step 1: Copy the application, excluding build artifacts**

```bash
rsync -a \
  --exclude node_modules --exclude .yarn --exclude .output \
  --exclude .vinxi --exclude .tanstack --exclude .env --exclude '.env.bak*' \
  ../tanstack/client/ tanstack/
```

- [ ] **Step 2: Verify exactly what arrived**

```bash
ls -A tanstack/
```

Expected: `.env.example .yarnrc.yml eslint.config.mjs package.json prettier.config.mjs README.md src tsconfig.json vite.config.ts yarn.lock`

- [ ] **Step 3: Reassign the port from 3000 to 3002**

Both keys must change together, or the app binds one port and advertises
another:

```bash
sed -i '' 's|^PORT=3000$|PORT=3002|' tanstack/.env.example
sed -i '' 's|WEBSITE_URL=http://localhost:3000|WEBSITE_URL=http://localhost:3002|' tanstack/.env.example
grep -E '^PORT=|WEBSITE_URL' tanstack/.env.example
```

Expected: `PORT=3002` and a `WEBSITE_URL` of `http://localhost:3002`.

- [ ] **Step 4: Update the stale comment in `.env.example`**

The file says "Change it (along with strapi/.env's PORT and CLIENT_URL) to
run alongside another LaunchPad stack." That advice is wrong here — ports
are fixed per frontend and `CLIENT_URL` is managed by `yarn use`. Replace
that comment block with:

```
# Port this frontend binds to. Fixed at 3002 because Next uses 3000 and
# Nuxt uses 3001. Switch the admin's Preview target with `yarn use`.
```

- [ ] **Step 5: Name the package after its directory**

The port's `package.json` has `"name": "tanstack"`. Make it consistent
with the other two:

```bash
node --import tsx -e "
import * as fs from 'fs';
const p = 'tanstack/package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.name = 'launchpad-tanstack';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
```

- [ ] **Step 6: Confirm the registry sees it, then set up**

```bash
yarn use          # expect: Available: next, astro, nuxt, tanstack
yarn setup
```

Expected: TanStack dependencies install, `tanstack/.env` created with
`PORT=3002`, `PREVIEW_SECRET: synced into tanstack/.env`, ending
`✓ Environment looks consistent.`

Note this frontend has an extra `REVALIDATE_SECRET`. `ensureEnvFile`
generates it from the `tobemodified` placeholder like any other.

- [ ] **Step 7: Confirm the Strapi URL key is the Vite-prefixed one**

```bash
grep '^VITE_STRAPI_URL=' tanstack/.env
```

Expected: `VITE_STRAPI_URL=http://localhost:1337`. This frontend uses
`VITE_STRAPI_URL`, not `STRAPI_URL`; the registry already knows this and
`yarn check:env` validates against it.

- [ ] **Step 8: Run the verification gate**

```bash
yarn dev:tanstack
```

Then in another shell:

```bash
for p in /en /fr /en/blog /en/products; do
  printf "%-14s %s bytes=%s\n" "$p" \
    "$(curl -s -o /tmp/p.html -w '%{http_code}' http://localhost:3002$p)" \
    "$(wc -c < /tmp/p.html)"
done
```

Expected: all four `200` with tens of kilobytes each.

- [ ] **Step 9: Verify a detail page renders real content**

```bash
SLUG=$(curl -s http://localhost:3002/en/blog | grep -oE '/en/blog/[a-z0-9-]+' | sort -u | head -1)
curl -s "http://localhost:3002$SLUG" | grep -o '<h1[^>]*>[^<]*' | head -1
```

Expected: an `<h1>` containing the article's real title.

- [ ] **Step 10: Verify the production build**

```bash
cd tanstack && yarn build && cd ..
```

Expected: build completes with no error.

- [ ] **Step 11: Verify no port collision with Next**

```bash
yarn dev            # Strapi + Next on 3000
```

In another shell, confirm `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/en` returns `200` and nothing is listening on 3002. Stop, then run `yarn dev:tanstack` and confirm the reverse.

- [ ] **Step 12: Format and commit**

```bash
yarn fix:format
git add tanstack/ .gitignore
git commit -m "feat(tanstack): add the TanStack Start frontend

Ports the standalone TanStack LaunchPad into the monorepo. Moves it from
port 3000 to 3002, since 3000 belongs to Next here."
```

---

### Task 9: Final verification and draft pull request

**Files:** none — this task only verifies and publishes.

**Interfaces:**
- Consumes: every preceding task.
- Produces: a draft PR on `strapi/LaunchPad`.

This is the first and only point at which anything leaves the machine.

- [ ] **Step 1: Confirm the branch stack is intact**

```bash
git log --oneline --graph main..feat/tanstack-frontend | head -30
```

Expected: every commit from the spec through TanStack, in order, with no
merge into `main`.

- [ ] **Step 2: Confirm `main` was never touched**

```bash
git rev-parse main; git rev-parse origin/main
```

Expected: identical hashes.

- [ ] **Step 3: Confirm no build artifacts or secrets are tracked**

```bash
git ls-files | grep -E "node_modules|\.output/|\.nuxt/|dist/|\.astro/|^[a-z]+/\.env$" ; echo "exit=$?"
```

Expected: no output, `exit=1`. Only `.env.example` files should be
tracked, never `.env`.

- [ ] **Step 4: Confirm every frontend still builds from clean**

```bash
for f in next astro nuxt tanstack; do
  echo "── $f"; (cd $f && yarn build > /tmp/$f.build.log 2>&1 && echo "  OK" || echo "  FAILED — see /tmp/$f.build.log")
done
```

Expected: `OK` for all four.

- [ ] **Step 5: Confirm formatting is clean**

```bash
yarn check:format
```

Expected: passes with no unformatted files.

- [ ] **Step 6: Push the branch**

```bash
git push -u origin feat/tanstack-frontend
```

This is the first push. It creates a branch on `strapi/LaunchPad` and
touches nothing else.

- [ ] **Step 7: Open the pull request as a draft**

```bash
gh pr create --draft --base main --head feat/tanstack-frontend \
  --title "Add Astro, Nuxt, and TanStack Start frontends" \
  --body "$(cat <<'BODY'
Brings the three standalone LaunchPad ports into this repository so all
four frontends share one Strapi backend and one git history.

## What changed

- `astro/`, `nuxt/`, and `tanstack/` join `next/` as siblings, all served
  by the existing `strapi/`.
- A frontend registry (`scripts/frontends.mts`) declares each frontend's
  port and Strapi URL key. Adding a framework is a directory plus an entry.
- `strapi/.env` is now the source of truth for `PREVIEW_SECRET`, which
  setup propagates to every frontend.
- `allowedOrigins` accepts all four frontends. `CLIENT_URL` selects which
  one the admin's Preview button opens, switchable via `yarn use`.
- The ports' backend-fetching scripts are gone — circular here, since
  `strapi/` is a sibling. 1,786 lines collapse to roughly 300.

## What did not change

`yarn dev` still starts Strapi + Next. A fresh clone behaves exactly as
before. This is not a Yarn workspace; each directory keeps its lockfile.

## Ports

| Frontend | Port |
|---|---|
| Next | 3000 |
| Nuxt | 3001 |
| TanStack | 3002 (was 3000 standalone) |
| Astro | 4321 |

## Verification

Each frontend was checked against the shared Strapi: `/en`, `/fr`,
`/en/blog`, and `/en/products` all return 200 with real seeded content, a
detail page renders its own title, the production build succeeds, and the
admin Preview button opens the selected frontend.

Draft for review. Please do not merge without a look at the environment
model in `scripts/env.mts` and the preview-target design.
BODY
)"
```

- [ ] **Step 8: Confirm the PR is a draft against `main`**

```bash
gh pr view --json isDraft,baseRefName,headRefName,url
```

Expected: `isDraft: true`, `baseRefName: main`, and the URL to report back.

---

## Self-review

**Spec coverage.** Every spec section maps to a task: target structure and
flattening (6, 7, 8); discarded scripts (3, and by omission in 6–8);
merging the three copies (2); preview secret (2); preview target and
`allowedOrigins` (2, 3, 4); root scripts (3); branch plan (branch headers);
verification gate (steps within 6, 7, 8 and again in 9); documentation (5);
out-of-scope items appear nowhere, as intended.

**One deliberate deviation from the spec.** The spec's file table lists
`scripts/env.mts` and `scripts/check-env.mts` but not `scripts/paths.mts`
or `scripts/run.mts`. Both were added here because `env.mts` and
`frontends.mts` would otherwise import from a deleted `config.mts`, and
`setup.mts`/`dev.mts` need a process runner. This is a decomposition
detail, not a design change.

**Placeholder scan.** No TBD, TODO, "similar to Task N", or "add error
handling" appears. Every code step carries complete code; every
verification step names the exact command and expected output.

**Type consistency.** `Frontend`, `FRONTENDS`, `presentFrontends`,
`getFrontend`, `frontendUrl` are defined in Task 1 and used under those
names in Tasks 2, 3, 6, 7, and 8. `readEnvValue`, `writeEnvValue`,
`ensureEnvFile`, `propagatePreviewSecret`, `setPreviewTarget`,
`currentPreviewTarget`, `checkEnv`, `reportCheck` are defined in Task 2 and
used under those names in Task 3. `run` is defined in Task 3 Step 4 and
used in `setup.mts` and `dev.mts`. `envPathFor` is exported from Task 2
because `setup.mts` needs it.

**Known risk.** Task 3 Step 4 defines `run.mts` after `setup.mts` (Step 3)
already imports it. An executor working strictly step-by-step will see one
failing import between those two steps. This ordering is intentional —
`setup.mts` is the reason `run.mts` exists — but the executor should
create both before running either.
