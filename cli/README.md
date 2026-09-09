# create-strapi-launchpad

Scaffold [LaunchPad](https://github.com/strapi/LaunchPad), Strapi's official
demo application, with the frontend you want to work in.

```bash
npx create-strapi-launchpad my-app
```

That clones LaunchPad, installs it, seeds the demo content, and starts the
dev servers. With no `--framework` it asks which frontend to run.

## Frontends

LaunchPad ships four frontends against one Strapi backend.

| Frontend       | Flag                         | Port |
| -------------- | ---------------------------- | ---- |
| Next.js        | `--framework next` (default) | 3000 |
| Nuxt 4         | `--framework nuxt`           | 3001 |
| TanStack Start | `--framework tanstack`       | 3002 |
| Astro          | `--framework astro`          | 4321 |

Strapi runs on **1337** for all of them.

```bash
npx create-strapi-launchpad my-app --framework astro
```

## Options

| Option                   | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `-f, --framework <name>` | Frontend to run. Prompts if omitted.                 |
| `-r, --ref <ref>`        | Branch or tag of the LaunchPad repo to clone.        |
| `--no-seed`              | Skip seeding the demo content.                       |
| `--no-start`             | Set everything up, but do not start the dev servers. |
| `--no-git`               | Do not initialize a git repository.                  |
| `--dry-run`              | Print what would happen and exit.                    |

## Requirements

- Node.js 20.19 or newer
- Git

Yarn is required. Every LaunchPad directory ships a `yarn.lock` and its
scripts call yarn directly, so that is what the CLI drives. If yarn is
missing, the CLI enables it through Corepack for you.

## What it does

1. Clones LaunchPad (shallow) and removes its history
2. Initializes a fresh git repository with one commit
3. `yarn install && yarn setup` — installs every workspace and writes `.env` files
4. `yarn seed` — imports the demo content into SQLite
5. `yarn dev` (or `dev:astro`, `dev:nuxt`, `dev:tanstack`)

Use `--dry-run` to see the plan for any combination of flags without touching
the disk.

## Development

```bash
npm install
npm test
node ./bin/cli.js my-app --dry-run
```

Frontends are declared in one place, [`src/frameworks.js`](src/frameworks.js).

It has to be a separate copy, because the CLI runs before the repo is cloned.
That copy can drift, and when it does the CLI checks the wrong port or calls a
dev script that does not exist. `test/registry-matches-launchpad.test.js`
reads the real sources — `../scripts/frontends.mts`, the root `package.json`
scripts and the frontend directories — and fails if they disagree.

That test is why this package lives in the LaunchPad repo rather than its own.
Run it from the repo root with `yarn test:cli`.

## License

MIT
