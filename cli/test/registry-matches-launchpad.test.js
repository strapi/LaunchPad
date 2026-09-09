import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { FRAMEWORKS, STRAPI_PORT } from '../src/frameworks.js';

/**
 * Guards the reason this CLI lives in the LaunchPad repo.
 *
 * The CLI keeps its own copy of the frontend list because it has to work
 * before the repo is cloned. That copy can drift from the real one, and when
 * it does the CLI checks the wrong port or calls a dev script that does not
 * exist — a failure the user sees, not us.
 *
 * These tests read the actual sources rather than a second copy of the
 * expected values, so they fail when LaunchPad changes and the CLI does not.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');

const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');

test('every frontend the CLI offers exists in the repo', () => {
  for (const f of FRAMEWORKS) {
    const dir = path.join(repoRoot, f.name);
    assert.ok(
      fs.existsSync(path.join(dir, 'package.json')),
      `${f.name}/ is offered by the CLI but not present in the repo`
    );
  }
});

test('every dev script the CLI calls exists in the root package.json', () => {
  const scripts = JSON.parse(read('package.json')).scripts ?? {};
  for (const f of FRAMEWORKS) {
    assert.ok(
      f.devScript in scripts,
      `the CLI would run "yarn ${f.devScript}" for ${f.name}, but that script does not exist`
    );
  }
});

test('ports match scripts/frontends.mts', () => {
  // The registry is TypeScript, so read the declarations rather than import.
  const source = read('scripts/frontends.mts');
  const declared = new Map(
    [...source.matchAll(/define\(\s*'([^']+)',\s*'[^']*',\s*(\d+)/g)].map(
      ([, name, port]) => [name, Number(port)]
    )
  );

  assert.ok(declared.size > 0, 'could not parse scripts/frontends.mts');

  for (const f of FRAMEWORKS) {
    assert.equal(
      declared.get(f.name),
      f.port,
      `${f.name}: CLI says port ${f.port}, scripts/frontends.mts says ${declared.get(f.name)}`
    );
  }

  assert.deepEqual(
    [...declared.keys()].sort(),
    FRAMEWORKS.map((f) => f.name).sort(),
    'the CLI and scripts/frontends.mts list different frontends'
  );
});

test('Strapi port matches strapi/.env.example', () => {
  const example = read('strapi/.env.example');
  const match = /^PORT=(\d+)/m.exec(example);
  if (!match) return; // not pinned there; nothing to check
  assert.equal(Number(match[1]), STRAPI_PORT);
});
