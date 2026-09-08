import { execaCommand } from 'execa';

import { log } from './logger.js';

// LaunchPad's frontends need this: Nuxt 4 and Astro 6 both require 20.19+.
// The old floor of 18 let people through to a confusing failure during install.
const MIN_NODE = [20, 19, 0];

function parseVersion(version) {
  return version.split('.').map((n) => parseInt(n, 10));
}

function isAtLeast(actual, required) {
  for (let i = 0; i < required.length; i++) {
    const a = actual[i] ?? 0;
    if (a > required[i]) return true;
    if (a < required[i]) return false;
  }
  return true;
}

export async function checkPrerequisites() {
  const nodeVersion = process.versions.node;

  if (!isAtLeast(parseVersion(nodeVersion), MIN_NODE)) {
    log.error(
      `Node.js ${MIN_NODE.join('.')} or higher is required. You are running v${nodeVersion}.`
    );
    process.exit(1);
  }
  log.success(`Node.js v${nodeVersion}`);

  try {
    await execaCommand('git --version');
  } catch {
    log.error('Git is not installed. Install it and try again.');
    process.exit(1);
  }

  // LaunchPad pins yarn@4.5.0 in its root package.json, so this is the only
  // package manager that will work. Corepack ships with Node and can provide
  // it without a global install.
  try {
    await execaCommand('yarn --version');
    log.success('Yarn available');
  } catch {
    log.warn('Yarn not found — enabling it through corepack...');
    try {
      await execaCommand('corepack enable');
      log.success('Corepack enabled, yarn is now available');
    } catch {
      log.error(
        'Could not enable yarn. Install it manually:\n' +
          '  corepack enable\n' +
          '  — or —\n' +
          '  npm install -g yarn\n\n' +
          'LaunchPad pins yarn@4.5.0, so npm and pnpm will not work.'
      );
      process.exit(1);
    }
  }
}
