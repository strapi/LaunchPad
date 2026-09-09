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

  // Every LaunchPad directory ships a yarn.lock and its scripts shell out to
  // yarn, so that is what the CLI drives. Corepack comes with Node and can
  // provide yarn without a global install.
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
          'LaunchPad is set up for yarn: every directory ships a yarn.lock\n' +
          'and its scripts call yarn directly.'
      );
      process.exit(1);
    }
  }
}
