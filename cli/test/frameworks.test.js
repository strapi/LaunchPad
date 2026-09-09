import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DEFAULT_FRAMEWORK,
  FRAMEWORKS,
  STRAPI_PORT,
  frameworkNames,
  getFramework,
} from '../src/frameworks.js';

test('every framework is fully described', () => {
  for (const f of FRAMEWORKS) {
    assert.ok(f.name, 'name');
    assert.ok(f.label, `label for ${f.name}`);
    assert.equal(typeof f.port, 'number', `port for ${f.name}`);
    assert.ok(f.devScript, `devScript for ${f.name}`);
  }
});

test('ports are unique and never collide with Strapi', () => {
  const ports = FRAMEWORKS.map((f) => f.port);
  assert.equal(new Set(ports).size, ports.length, 'ports must be unique');
  assert.ok(!ports.includes(STRAPI_PORT), 'no frontend may use Strapi’s port');
});

test('the default framework exists', () => {
  assert.ok(getFramework(DEFAULT_FRAMEWORK));
});

test('getFramework returns null for an unknown name', () => {
  assert.equal(getFramework('svelte'), null);
});

test('only next uses the bare dev script', () => {
  // Every other frontend needs its own script, or the CLI would silently
  // start Next while claiming to start something else.
  for (const f of FRAMEWORKS) {
    if (f.name === 'next') assert.equal(f.devScript, 'dev');
    else assert.equal(f.devScript, `dev:${f.name}`);
  }
});

test('frameworkNames matches the registry', () => {
  assert.deepEqual(
    frameworkNames(),
    FRAMEWORKS.map((f) => f.name)
  );
});
