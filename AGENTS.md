# AGENTS.md

Guidance for LLM agents working in this repository.

## Repo Overview

LaunchPad is the official Strapi demo app.

- `strapi/`: Strapi 5 backend, content types, components, seeded demo data, SQLite default database.
- `next/`: Next.js 15 App Router frontend, React 19, Tailwind, localized `en` and `fr` routes.
- Root: workspace-level setup/dev/format scripts using Yarn 4.5.0.

## First Read

Before editing, read:

- `README.md`
- `package.json`
- `next/package.json`
- `strapi/package.json`
- Relevant files under `next/app`, `next/components`, `next/lib/strapi`, or `strapi/src`.

## Commands

Run commands from the correct directory.

- Root setup: `yarn setup`
- Root dev: `yarn dev`
- Seed Strapi: `yarn seed`
- Format check: `yarn check:format`
- Format fix: `yarn fix:format`
- Next dev: `cd next && yarn dev`
- Next build: `cd next && yarn build`
- Next lint: `cd next && yarn lint`
- Strapi dev: `cd strapi && yarn develop`
- Strapi build: `cd strapi && yarn build`

## Setup

Run once after cloning, from the repo root:

```sh
yarn install          # install root workspace deps first
yarn setup            # installs next/ and strapi/ deps, copies .env files
yarn seed             # imports demo data into SQLite (191 entities, 115 assets)
```

`yarn setup` calls `setup:next` and `setup:strapi` in sequence. Each sub-script runs `yarn` in the sub-directory then copies `.env.example` → `.env` only if `.env` does not already exist.

`yarn seed` is destructive — it wipes existing data before importing. Re-run it to reset to the demo baseline.

After setup, verify both apps are healthy:

```sh
cd next && yarn build
cd strapi && yarn build
```

First `yarn develop` in `strapi/` will prompt to create a Super Admin at `http://localhost:1337/admin`; the seed does not include admin credentials.

## Environment

Create local env files before running the apps:

- `cp ./strapi/.env.example ./strapi/.env`
- `cp ./next/.env.example ./next/.env`

`yarn setup` does this automatically. Do not commit real secrets. Keep demo placeholders only. If using Next.js draft/preview mode, set a matching `PREVIEW_SECRET` in both files.

## Coding Style

- Prefer small, direct changes over broad refactors.
- Prefer `type` over `interface` unless extending existing interfaces or matching local code.
- Prefer `unknown` over `any`; tighten existing broad types incrementally.
- Use explicit comparisons:
  - Prefer `value === undefined`, `value === null`, `items.length === 0`, `enabled === true`.
  - Avoid relying on broad truthy/falsy checks for new code.
- Keep existing Prettier settings: semicolons, single quotes, 2 spaces, trailing commas where valid.
- Add comments only when they explain non-obvious behavior.

## Strapi Changes

- Update content-type schemas under `strapi/src/api/**/content-types/**/schema.json`.
- Update components under `strapi/src/components/**`.
- When adding a new dynamic-zone component, update both Strapi schema/components and the Next dynamic-zone mapping.
- Be careful with `deepPopulate`: it affects default GET API responses globally.
- The default database is SQLite at `strapi/.tmp/data.db`; do not commit generated database files.

## Next Changes

- App routes live under `next/app/[locale]`.
- Shared Strapi rendering logic lives under `next/lib/shared`.
- UI components live under `next/components`.
- Use the `@/` alias from `next/tsconfig.json`.
- Keep server data fetching in server components/helpers unless interactivity requires a client component.
- When touching localized pages, verify localized slugs and locale switcher behavior.

## Verification

Choose the smallest useful check for the change:

- Docs-only: `yarn check:format`
- Next UI/data changes: `cd next && yarn lint && yarn build`
- Strapi schema/backend changes: `cd strapi && yarn build`
- Full confidence path: `yarn check:format`, `cd next && yarn lint && yarn build`, `cd strapi && yarn build`

