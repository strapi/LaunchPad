# AGENTS.md

Guidance for LLM agents working in this repository.

## Repo Overview

This branch (`enterprise-demo`) is the Strapi Enterprise sales demo: one fictional insurance group, Meridian Mutual Group, a corporate website in four languages, and a seed that builds the whole demo state with no manual step.

- `strapi/`: Strapi 5.58 backend, content types in `src/api`, components in `src/components`, content-type folders in `src/content-structure/groups.json`, the dataset in `data/demo`, the seed in `scripts/seed.js`. SQLite.
- `next/`: Next.js 16 App Router frontend, React 19, Tailwind 3, locales `en`, `fr`, `de`, `it`, Live Preview wired.
- `README.md`: setup, users, what the seed creates.
- Root: setup/dev/format scripts using Yarn 4.5.0. Each directory keeps its own lockfile; this is not a Yarn workspace.

## First Read

Before editing, read:

- `README.md`
- `package.json`
- `next/package.json`
- `strapi/package.json`
- Relevant files under `next/app`, `next/components`, `next/lib/strapi`, or `strapi/src`.

## Commands

Run commands from the correct directory.

- Root setup: `yarn setup` (installs Strapi and every checked-out frontend)
- Root dev: `yarn dev` (Strapi + Next)
- Switch the admin Preview target: `yarn use <framework>`
- Check environment consistency: `yarn check:env`
- Seed Strapi: `yarn seed` (wipes and rebuilds everything, stop the dev server first)
- Format check: `yarn check:format`
- Format fix: `yarn fix:format`
- Strapi dev: `cd strapi && yarn develop`
- Strapi build: `cd strapi && yarn build`
- A frontend directly: `cd <framework> && yarn dev`

## Setup

Run once after cloning, from the repo root:

```sh
yarn install          # install root deps first
yarn setup            # installs strapi/ and every frontend, creates .env files
yarn seed             # builds the whole demo state from strapi/data/demo (content, media, roles, users, workflow, releases, history)
```

`yarn setup` installs each directory in turn, creates any missing `.env` from its `.env.example`, and propagates `PREVIEW_SECRET` from `strapi/.env` to every frontend. It is safe to re-run: existing `.env` files are left alone and an already-configured preview secret is preserved.

`yarn seed` is destructive: it wipes the database and uploads before rebuilding. Re-run it to reset to the demo baseline. Keep `strapi/scripts/seed.js` in sync with any schema change.

After setup, verify both apps are healthy:

```sh
cd strapi && yarn build
cd next && yarn build
```

The seed creates the admin users (see README.md); no first-admin prompt.

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

## Frontend Changes

All four frontends render the same Strapi content and must stay at feature
parity: the full dynamic-zone block set, blog, products, CMS-driven pages,
`en`/`fr` routing, draft preview, and authentication. A change to one
frontend's rendering usually needs the same change in the other three.

Paths below are given for `next/`; each other frontend has an equivalent
location following its own framework's conventions.

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
