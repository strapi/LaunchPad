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
import { isPortAvailable, portOwner } from '../utils/ports.js';
import { checkPrerequisites } from '../utils/prerequisites.js';

const DEFAULT_REPO = 'https://github.com/strapi/LaunchPad.git';

/**
 * git treats a local path as a clone source, which is far quicker than going
 * to GitHub and works offline. `--depth` is ignored for a plain path, so a
 * local source is rewritten to a file:// URL to keep the clone shallow.
 */
function normalizeRepo(repo) {
  if (!repo) return { url: DEFAULT_REPO, local: false };
  if (/^[a-z]+:\/\//i.test(repo) || repo.includes('@')) {
    return { url: repo, local: false };
  }
  const abs = path.resolve(process.cwd(), repo);
  if (!fs.existsSync(path.join(abs, '.git'))) {
    console.log();
    log.error(`No git repository at ${abs}`);
    console.log();
    process.exit(1);
  }
  return { url: `file://${abs}`, local: true };
}

// LaunchPad pins yarn in its root package.json, so Corepack will refuse any
// other package manager. There is no point offering a choice.
const PM = 'yarn';

/**
 * Which frontend to scaffold.
 *
 * All four live on LaunchPad's default branch, so every option works without
 * a --ref.
 */
async function resolveFramework(flag) {
  if (flag) {
    const framework = getFramework(flag);
    if (!framework) {
      console.log();
      log.error(
        `Unknown framework "${flag}". Expected one of: ${frameworkNames().join(', ')}`
      );
      console.log();
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

/** The frontends present in a cloned LaunchPad tree. */
function detectFrameworks(targetDir) {
  return FRAMEWORKS.filter((f) =>
    fs.existsSync(path.join(targetDir, f.name, 'package.json'))
  );
}

/**
 * Ports the chosen frontend needs, and who currently holds them.
 *
 * Reported before anything is cloned. A second LaunchPad checkout left
 * running is the awkward case: it answers on the right port with its own
 * PREVIEW_SECRET, so the admin's preview fails with "Invalid token" rather
 * than anything that points at a port conflict.
 */
async function findBlockedPorts(framework) {
  const wanted = [
    { port: STRAPI_PORT, label: 'Strapi' },
    { port: framework.port, label: framework.label },
  ];

  const blocked = [];
  for (const { port, label } of wanted) {
    if (await isPortAvailable(port)) continue;
    blocked.push({ port, label, owner: await portOwner(port) });
  }
  return blocked;
}

function reportBlockedPorts(blocked) {
  for (const { port, label, owner } of blocked) {
    log.warn(`Port ${port} (${label}) is already in use.`);
    if (owner) console.log(`    held by: ${owner}`);
  }
}

function printPlan(targetDir, framework, options, ref, repoUrl) {
  const steps = [
    `clone ${repoUrl}${ref ? ` (ref ${ref})` : ''} into ${targetDir}`,
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

  console.log();

  const framework = await resolveFramework(options.framework);
  const repo = normalizeRepo(options.repo);
  const ref = options.ref;

  if (options.dryRun) {
    printPlan(targetDir, framework, options, ref, repo.url);
    return;
  }

  log.info(`Creating LaunchPad app in ${targetDir}`);
  log.info(`Frontend: ${chalk.bold(framework.label)}`);

  // Checked here rather than only before starting, so a conflict surfaces now
  // instead of after a clone and an install — and so it is still reported when
  // --no-start means nothing will be started at all.
  const blockedUpFront = await findBlockedPorts(framework);
  if (blockedUpFront.length > 0) {
    console.log();
    reportBlockedPorts(blockedUpFront);
    console.log(
      `    another LaunchPad on that port has its own PREVIEW_SECRET, which makes preview fail with "Invalid token"`
    );
  }

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

  // LaunchPad is ~54MB, so this takes roughly 20 seconds over the network.
  // A bare spinner for that long reads as a hang, so the elapsed time is
  // shown. git's own --progress is not used: it emits thousands of
  // carriage-return updates that do not collapse when stdout is not a TTY.
  const started = Date.now();
  const cloneSpinner = ora('Cloning (about 20s, ~54MB)...').start();
  const tick = setInterval(() => {
    const secs = Math.round((Date.now() - started) / 1000);
    cloneSpinner.text = `Cloning (about 20s, ~54MB)... ${secs}s`;
  }, 1000);

  try {
    const args = ['clone', '--depth=1'];
    if (ref) args.push('--branch', ref);
    args.push(repo.url, targetDir);
    await execa('git', args);
    fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });
    clearInterval(tick);
    cloneSpinner.succeed(`Repository cloned${ref ? ` (${ref})` : ''}`);
  } catch (error) {
    clearInterval(tick);
    cloneSpinner.fail('Failed to clone repository');
    log.error(
      ref
        ? `Could not clone ref "${ref}". Check the branch or tag exists.`
        : error.message
    );
    process.exit(1);
  }

  // Safety net: the ref resolved above should always carry the chosen
  // frontend, but a stale --ref or a renamed directory would slip through and
  // fail much later on a dev script that does not exist.
  const available = detectFrameworks(targetDir);
  if (!available.some((f) => f.name === framework.name)) {
    console.log();
    log.error(
      `This ref has no ${framework.name}/ directory, so ${framework.label} cannot run.`
    );
    console.log(
      `  Available here: ${available.map((f) => f.name).join(', ') || 'none'}`
    );
    if (options.ref)
      console.log('  Try omitting --ref, or pick a ref that has it.');
    console.log();
    process.exit(1);
  }

  // The clone's history is removed above, so give the user a repo of their own
  // rather than leaving the directory untracked.
  if (options.git) {
    try {
      await execa('git', ['init', '-q'], { cwd: targetDir });
      await execa('git', ['add', '-A'], { cwd: targetDir });
      await execa(
        'git',
        ['commit', '-q', '-m', 'Initial commit from create-strapi-launchpad'],
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

    // setup writes the shared PREVIEW_SECRET to every frontend, but leaves
    // CLIENT_URL at its default of Next. Strapi reads CLIENT_URL to build the
    // admin's Preview link, so without this the Preview button opens Next
    // whatever frontend was chosen.
    await execa(PM, ['use', framework.name], { cwd: targetDir });

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

  const blocked = await findBlockedPorts(framework);

  if (blocked.length > 0) {
    console.log();
    reportBlockedPorts(blocked);
    console.log();
    console.log(
      '  Either stop whatever is using them, or change the ports in:'
    );
    const envPaths = [
      [`${directory}/strapi/.env`, 'Strapi'],
      [`${directory}/${framework.name}/.env`, framework.label],
    ];
    const width = Math.max(...envPaths.map(([envPath]) => envPath.length));
    for (const [envPath, label] of envPaths) {
      console.log(`    ${envPath.padEnd(width)}  → ${label}`);
    }
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
