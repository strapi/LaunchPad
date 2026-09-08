import * as p from '@clack/prompts';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import {
  DEFAULT_FRAMEWORK,
  FRAMEWORKS,
  STRAPI_PORT,
  frameworkNames,
  getFramework,
} from '../frameworks.js';
import { log } from '../utils/logger.js';
import { isPortAvailable } from '../utils/ports.js';
import { checkPrerequisites } from '../utils/prerequisites.js';

const REPO_URL = 'https://github.com/strapi/LaunchPad.git';

// LaunchPad pins yarn in its root package.json, so Corepack will refuse any
// other package manager. There is no point offering a choice.
const PM = 'yarn';

/**
 * Which frontend to scaffold: the flag if given, otherwise a prompt.
 *
 * An unknown --framework is rejected rather than silently falling back, so a
 * typo in a script fails loudly.
 */
async function resolveFramework(flag) {
  if (flag) {
    const framework = getFramework(flag);
    if (!framework) {
      log.error(
        `Unknown framework "${flag}". Expected one of: ${frameworkNames().join(', ')}`
      );
      process.exit(1);
    }
    return framework;
  }

  // Not a TTY (CI, piped input) — prompting would hang.
  if (!process.stdin.isTTY) return getFramework(DEFAULT_FRAMEWORK);

  const choice = await p.select({
    message: 'Which frontend would you like to run?',
    options: FRAMEWORKS.map((f) => ({
      value: f.name,
      label: f.label,
      hint: `port ${f.port}`,
    })),
    initialValue: DEFAULT_FRAMEWORK,
  });

  if (p.isCancel(choice)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }

  return getFramework(choice);
}

/**
 * Fails early when the cloned ref predates the chosen frontend.
 *
 * Without this the run gets several steps further before `yarn dev:astro`
 * fails with something far less obvious.
 */
function assertFrameworkPresent(targetDir, framework, ref) {
  if (framework.name === DEFAULT_FRAMEWORK) return;
  if (fs.existsSync(path.join(targetDir, framework.name))) return;

  const available = FRAMEWORKS.filter((f) =>
    fs.existsSync(path.join(targetDir, f.name))
  ).map((f) => f.name);

  console.log();
  log.error(
    `This LaunchPad ref has no ${framework.name}/ directory, so --framework ${framework.name} cannot work.`
  );
  console.log(`  Available here: ${available.join(', ') || 'none'}`);
  console.log(
    `  Try a ref that includes it, e.g. --ref feat/tanstack-frontend`
  );
  console.log();
  process.exit(1);
}

function printPlan(targetDir, framework, options, ref) {
  const steps = [
    `clone ${REPO_URL}${ref ? ` (ref ${ref})` : ''} into ${targetDir}`,
    options.git ? 'git init' : 'skip git init (--no-git)',
    `${PM} install && ${PM} setup`,
    options.seed ? `${PM} seed` : 'skip seed (--no-seed)',
    options.start
      ? `${PM} ${framework.devScript}  → Strapi :${STRAPI_PORT}, ${framework.label} :${framework.port}`
      : 'skip dev start (--no-start)',
  ];

  console.log();
  log.info(`Plan for ${chalk.bold(framework.label)}:`);
  steps.forEach((s, i) => console.log(`  ${chalk.cyan(`${i + 1}.`)} ${s}`));
  console.log();
  log.info('Dry run — nothing was changed.');
  console.log();
}

export async function createLaunchpadApp(directory, options) {
  const targetDir = path.resolve(process.cwd(), directory);
  const ref = options.ref;

  console.log();
  const framework = await resolveFramework(options.framework);

  if (options.dryRun) {
    printPlan(targetDir, framework, options, ref);
    return;
  }

  log.info(`Creating LaunchPad app in ${targetDir}`);
  log.info(`Frontend: ${chalk.bold(framework.label)}\n`);

  await checkPrerequisites(PM);
  console.log();

  // Steps vary with the flags, so count them rather than hardcoding a total
  // that drifts every time one becomes conditional.
  const stepLabels = [
    'Cloning LaunchPad repository',
    'Installing dependencies',
    options.seed && 'Seeding demo data',
    options.start ? 'Starting development servers' : 'Finishing up',
  ].filter(Boolean);
  const total = stepLabels.length;
  let step = 0;
  const nextStep = (msg) => log.step(++step, total, msg);

  // --- Clone ---
  nextStep('Cloning LaunchPad repository...');

  if (fs.existsSync(targetDir)) {
    log.error(
      `Directory "${directory}" already exists. Pick a different name.`
    );
    process.exit(1);
  }

  const cloneSpinner = ora('Cloning...').start();
  try {
    const args = ['clone', '--depth=1'];
    if (ref) args.push('--branch', ref);
    args.push(REPO_URL, targetDir);
    await execa('git', args);
    fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });
    cloneSpinner.succeed(`Repository cloned${ref ? ` (${ref})` : ''}`);
  } catch (error) {
    cloneSpinner.fail('Failed to clone repository');
    log.error(
      ref
        ? `Could not clone ref "${ref}". Check the branch or tag exists.`
        : error.message
    );
    process.exit(1);
  }

  assertFrameworkPresent(targetDir, framework, ref);

  // The clone's history is removed above, so give the user a repo of their own
  // rather than leaving the directory untracked.
  if (options.git) {
    try {
      await execa('git', ['init', '-q'], { cwd: targetDir });
      await execa('git', ['add', '-A'], { cwd: targetDir });
      await execa(
        'git',
        ['commit', '-q', '-m', 'Initial commit from create-launchpad-app'],
        { cwd: targetDir }
      );
      log.success('Initialized a git repository');
    } catch {
      // A missing git identity is the usual cause. Not worth failing the run.
      log.warn('Could not create the initial commit — continuing');
    }
  }

  // --- Install ---
  nextStep('Installing dependencies...');
  const installSpinner = ora('Running setup...').start();
  try {
    await execa(PM, ['install'], { cwd: targetDir });
    await execa(PM, ['setup'], { cwd: targetDir });
    installSpinner.succeed('Dependencies installed');
  } catch (error) {
    installSpinner.fail('Failed to install dependencies');
    log.error(error.message);
    process.exit(1);
  }

  // --- Seed ---
  if (options.seed) {
    nextStep('Seeding demo data...');
    const seedSpinner = ora('Seeding...').start();
    try {
      await execa(PM, ['seed'], { cwd: targetDir });
      seedSpinner.succeed('Demo data seeded');
    } catch (error) {
      seedSpinner.fail('Failed to seed data');
      log.error(error.message);
      process.exit(1);
    }
  }

  // --- Start ---
  if (!options.start) {
    nextStep('Finishing up');
    console.log();
    log.success('LaunchPad is ready! To start:');
    console.log(`\n  cd ${directory}`);
    console.log(`  ${PM} ${framework.devScript}\n`);
    return;
  }

  nextStep('Starting development servers...');

  const blocked = [];
  if (!(await isPortAvailable(STRAPI_PORT))) {
    blocked.push(`${STRAPI_PORT} (Strapi)`);
  }
  if (!(await isPortAvailable(framework.port))) {
    blocked.push(`${framework.port} (${framework.label})`);
  }

  if (blocked.length > 0) {
    console.log();
    log.error(`Port ${blocked.join(' and ')} already in use.`);
    console.log();
    console.log(
      '  Either stop whatever is using them, or change the ports in:'
    );
    console.log(`    ${directory}/strapi/.env            → Strapi`);
    console.log(
      `    ${directory}/${framework.name}/.env${' '.repeat(Math.max(0, 12 - framework.name.length))} → ${framework.label}`
    );
    console.log();
    console.log('  Then start it yourself:');
    console.log(`    cd ${directory}`);
    console.log(`    ${PM} ${framework.devScript}`);
    console.log();
    process.exit(1);
  }

  console.log();
  log.info(`Strapi admin  → http://localhost:${STRAPI_PORT}/admin`);
  log.info(`${framework.label} → http://localhost:${framework.port}`);
  console.log();

  try {
    await execa(PM, [framework.devScript], {
      cwd: targetDir,
      stdio: 'inherit',
    });
  } catch {
    // Ctrl+C is the normal way out of a dev server.
  }
}
