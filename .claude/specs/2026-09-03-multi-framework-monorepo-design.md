# Multi-Framework LaunchPad: Design

**Date:** 2026-09-03
**Status:** Approved, not yet implemented

## Goal

Bring the Astro, Nuxt, and TanStack Start ports of LaunchPad into this
repository so that all four frontends share one Strapi backend and one
git history. After this work, LaunchPad is the only place any of this
code is developed. The three standalone port repositories were
placeholders and stop being development targets.

## Source material

The three ports are checked out locally, as siblings of this repository:

| Framework | Local path | Origin |
|---|---|---|
| Astro | `../astro` | `PaulBratslavsky/astro-launchpad-strapi-port` |
| Nuxt | `../nuxt` | `PaulBratslavsky/nuxt-launchpad-strapi-port` |
| TanStack | `../tanstack` | `PaulBratslavsky/tanstack-launchpad-strapi-port` |

Each has the shape `client/` + `scripts/` + `launchpad.json` + a gitignored
`strapi/` fetched from this repository. Only `client/` and parts of
`scripts/` carry forward.

## Constraints

These came from the repository owner and are not negotiable within this
design:

1. Nothing merges into `main`. All work lands on branches.
2. Nothing is pushed to `strapi/LaunchPad` until all three frameworks
   are integrated. Every branch stays local until then.
3. Each unit of work gets its own branch.
4. Next.js remains the default frontend. A fresh clone must behave
   exactly as it does today.

## Target structure

```
LaunchPad/
  strapi/       one backend, shared by all four frontends
  next/         unchanged                       :3000
  astro/        from the Astro port's client/     :4321
  nuxt/         from the Nuxt port's client/      :3001
  tanstack/     from the TanStack port's client/  :3002  (was 3000)
  scripts/      copy-env.mts, env.mts
  package.json  dev, dev:astro, dev:nuxt, dev:tanstack, setup, use
```

Each port currently nests its application under `client/`. That level is
removed so every frontend sits directly in a top-level directory, matching
the existing `next/`.

The flatten is safe. No source file in any port references `client/` as a
path. The only matches are the `@strapi/client` package name, `vite/client`
and `astro/client` type references, and build artifacts under `.output/`,
`.nuxt/`, `dist/`, and `.astro/`, all of which are gitignored and
regenerated.

TanStack moves from port 3000 to 3002 because 3000 belongs to Next. This
gives Next, Nuxt, and TanStack a 3000/3001/3002 run, with Astro on its
own default of 4321.

## What the ports discard

Each port carries 560 to 615 lines of orchestration whose sole purpose is
fetching this repository's `strapi/` directory at a pinned commit. Inside
this repository that is circular: the backend is a sibling directory. 1,786
lines across the three ports collapse to roughly 300.

| File | Lines (all 3) | Fate |
|---|---|---|
| `env.mts` | 654 | Survives as one shared `scripts/env.mts`. |
| `fetch-backend.mts` | 319 | Deleted. The backend is a sibling. |
| `setup.mts` | 187 | Collapses into the root `yarn setup`. |
| `config.mts` | 163 | Deleted. `launchpad.json` pinning is moot. |
| `dev.mts` | 153 | Deleted. Replaced by root scripts. |
| `run.mts` | 142 | Deleted. Replaced by root scripts. |
| `seed.mts` | 126 | Deleted. Duplicates the root `yarn seed`. |
| `check-env.mts` | 42 | Collapses to one shared copy. |
| **Total** | **1,786** | |
| `launchpad.json`, root `package.json` | — | Deleted. |

`env.mts` is the piece worth keeping. It provides `reconcilePreviewSecret()`,
`reconcileClientUrl()`, `checkEnv()`, and `readEnvValue`/`writeEnvValue`. It is
synchronous and it validates, where the current `copy-env.mts` is
callback-based and silent when configuration drifts.

### On merging the three copies

The three copies of these scripts are close to identical. Normalizing for
Prettier settings, the differences between the TanStack copy and the Nuxt
copy are:

- Multi-line versus single-line imports (`printWidth`)
- Trailing commas (`seed.mts` differs by nothing else)
- Comment prose naming the specific framework
- Port numbers and framework names in help text

There is exactly one functional gap: the TanStack copy lacks
`reconcileClientUrl()`. Merging the three is close to mechanical, not a
rewrite.

## Environment model

### Preview secret

Today `copy-env.mts` reads the shared `PREVIEW_SECRET` from `../next/.env`.
With four frontends, Next should not be the origin of a value all four
depend on. **`strapi/.env` becomes the source of truth**, and setup
propagates it outward to all four frontends.

All three ports already use this repository's placeholder convention
(`PREVIEW_SECRET=preview_secret`, `SESSION_SECRET=tobemodified`), so
`copy-env.mts` works on them with only the source-of-truth change.

A mismatch in any frontend produces an opaque 401 at preview time, so
`yarn check:env` gains a cross-frontend consistency check that compares
every frontend's `PREVIEW_SECRET` against `strapi/.env`.

### Preview target

`strapi/config/admin.ts` hardcodes a single frontend in two places:

```ts
allowedOrigins: [clientUrl]
return `${clientUrl}/api/preview?${urlSearchParams}`
```

All four frontends already expose `/api/preview`:

| Frontend | Route |
|---|---|
| Next | `next/app/api/preview/route.ts` |
| Astro | `astro/src/pages/api/preview.ts` |
| Nuxt | `nuxt/server/api/preview.get.ts` |
| TanStack | `tanstack/src/routes/api.preview.tsx` |

So the hardcoded path needs no change. Only `clientUrl` is a problem, and
the design addresses it in two parts.

**`allowedOrigins` lists all four origins.** It is a one-element array only
because there was one frontend. Widening it has no downside.

**`CLIENT_URL` selects which frontend the admin's Preview button opens.**
Strapi's preview handler must return a single URL string; there is no API
for offering a choice. `CLIENT_URL` therefore changes meaning from "the
frontend" to "the active preview target". It continues to default to
`http://localhost:3000`.

### Switching the target

```
yarn use nuxt        # CLIENT_URL -> http://localhost:3001
yarn use next        # back to the default
yarn use             # print the current target
```

`yarn use` rewrites one line in `strapi/.env`. That file is gitignored, so
switching never appears in `git status`.

`yarn dev:<framework>` additionally applies the switch for that run. This
is safe precisely because `dev:<framework>` boots Strapi itself, so there
is no ambiguity about which Strapi read which value.

Both mechanisms are needed, and each is wrong alone:

- Auto-switching alone breaks when Strapi is started separately. Running
  `yarn dev` in one terminal and `cd nuxt && yarn dev` in another (which is
  forced, since Strapi's port is taken) leaves `CLIENT_URL` untouched, and
  Preview silently opens Next while the developer is looking at Nuxt.
- Manual-only switching is tedious in the common case, where
  `dev:<framework>` already controls the Strapi boot.

**Strapi reads `CLIENT_URL` at boot.** Running `yarn use` while Strapi is
running changes nothing until it restarts. `yarn use` must detect a
listener on the Strapi port and warn:

```
Switched preview target to nuxt (http://localhost:3001)
!  Strapi is running - restart it for this to take effect.
```

Succeeding silently while the button still opens Next is the failure mode
this warning exists to prevent.

## Root scripts

`yarn dev` keeps its current meaning, so nothing breaks for existing
contributors or open pull requests.

```
yarn dev             strapi + next        (unchanged)
yarn dev:astro       strapi + astro
yarn dev:nuxt        strapi + nuxt
yarn dev:tanstack    strapi + tanstack
yarn setup           all four frontends + strapi
yarn seed            unchanged
yarn use <fw>        set the preview target
yarn check:env       env consistency across all frontends
```

## Branch plan

All branches are local until every framework is integrated. Branches stack,
because the groundwork cannot merge to `main` and be re-cut from.

```
main                                       untouched, never pushed to
 |
 +-- docs/multi-framework-integration-spec  this document
      |
      +-- chore/multi-framework-groundwork  scripts, env model, root pkg, docs
           |
           +-- feat/astro-frontend          astro/
                |
                +-- feat/nuxt-frontend      nuxt/
                     |
                     +-- feat/tanstack-frontend   tanstack/
```

Order is Astro, then Nuxt, then TanStack. Astro and Nuxt share the most
script internals, so doing them first establishes the merged shape that
TanStack then adopts.

The cost of stacking is that a groundwork fix discovered mid-way requires
rebasing down the stack. With three frameworks and one author that is
cheap, and it is the only shape that satisfies the constraint against
touching `main`.

When all three are done, the final branch is pushed to `strapi/LaunchPad`
as a branch. Merging is left to a pull request and is not part of this work.

## Verification gate

No framework branch is complete until, against the shared Strapi:

1. `yarn setup` completes clean from a fresh state
2. `yarn dev:<framework>` boots both services
3. `/en`, `/fr`, `/en/blog`, `/en/products` all return 200 with real
   seeded content, not empty shells
4. A blog detail page and a product detail page render their content
5. The admin Preview button opens the correct frontend after
   `yarn use <framework>` and a Strapi restart
6. The production build succeeds
7. `yarn check:format` passes

Item 3 checks rendered content rather than status codes alone, because a
frontend that has lost its Strapi connection still returns 200 with an
empty shell.

## Documentation

`AGENTS.md` and `README.md` both describe a two-directory repository
explicitly. The groundwork branch rewrites both for the four-frontend
shape. Each framework branch then adds its own section.

`AGENTS.md` needs particular care: it lists per-directory commands that
agents rely on, and stale entries there cause agents to run commands that
no longer exist.

## Out of scope

- Merging any branch into `main`
- Pushing anything before all three frameworks are integrated
- Converting the repository to Yarn workspaces. Each directory keeps its
  own lockfile, matching how `next/` and `strapi/` work today.
- Changing any frontend's application code beyond what relocation, port
  reassignment, and the shared environment model require
- Archiving or deleting the three standalone port repositories
