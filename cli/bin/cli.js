#!/usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'node:module';

import { createLaunchpadApp } from '../src/commands/create.js';
import { FRAMEWORKS, frameworkNames } from '../src/frameworks.js';

// Read the version from package.json rather than repeating it here, so the
// two cannot drift.
const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const frameworkList = FRAMEWORKS.map(
  (f) => `    ${f.name.padEnd(9)} ${f.label} (port ${f.port})`
).join('\n');

program
  .name('create-launchpad-app')
  .description('Scaffold the official Strapi LaunchPad demo application')
  .version(version)
  .argument('[directory]', 'directory to create the project in', 'launchpad')
  .option(
    '-f, --framework <name>',
    `frontend to run (${frameworkNames().join(', ')}) — prompts if omitted`
  )
  .option('-r, --ref <ref>', 'branch or tag of the LaunchPad repo to clone')
  .option('--no-seed', 'skip seeding demo data')
  .option('--no-start', 'skip starting dev servers after setup')
  .option('--no-git', 'skip initializing a git repository')
  .option('--dry-run', 'print what would happen without doing it')
  .addHelpText(
    'after',
    `
Frontends:
${frameworkList}

Examples:
  $ create-launchpad-app my-app
  $ create-launchpad-app my-app --framework astro
  $ create-launchpad-app my-app --framework nuxt --no-start
  $ create-launchpad-app my-app --dry-run

All frontends share one Strapi backend on port ${1337}.
`
  )
  .action(async (directory, options) => {
    try {
      await createLaunchpadApp(directory, options);
    } catch (error) {
      console.error(error?.message ?? error);
      process.exit(1);
    }
  });

program.parse();
