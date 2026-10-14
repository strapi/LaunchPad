# LaunchPad: Enterprise demo (Meridian Mutual Group)

A Strapi 5 sales demo built around one fictional customer: **Meridian Mutual Group**, an insurance group with a headquarters team, three country teams (France, Germany, Italy), a compliance team and a platform team, publishing a corporate website in four languages.

Everything is seeded by one command. Nothing is added by hand in the admin.

- `strapi/`: Strapi 5 backend (TypeScript, SQLite), content model, seed script and demo dataset.
- `next/`: Next.js 16 corporate website with Live Preview, four locales and the scheduled promo banner.
- `DEMO.md`: the demo script, scene by scene, with what to click and what to say.

## Setup (once)

Prerequisites: Node 20 or 22, Yarn 4 (`corepack enable`), an Enterprise or trial licence key.

```sh
yarn install
yarn setup            # installs strapi/ and next/, creates the .env files, shares PREVIEW_SECRET
```

Put your licence in `strapi/.env`:

```
STRAPI_LICENSE=your-licence-key
```

Without a licence the demo still runs, but the seed skips Review workflows, Releases, Audit logs and Content history and tells you so. Scenes 1, 3 and 5 then need the recordings.

## Seed the demo (and reset it any time)

```sh
yarn seed
```

Stop the dev server first (`yarn seed` boots its own Strapi on port 1340). The seed wipes the database and the uploads folder, then creates, in order: four locales, 44 media files, all content in four languages, public API permissions, five admin roles and six users, the "Regulated content" review workflow, the three releases, and the attributed activity that the scenes rely on (the Italian rate change with its history, the compliance rejection, logins for every user). About 40 seconds.

Run it again whenever a demo left the data in a mess. It is the reset button.

## Run

```sh
yarn dev              # Strapi on :1337, Next.js on :3000
```

- Admin: http://localhost:1337/admin
- Website: http://localhost:3000 (redirects to your browser language; `/it`, `/fr`, `/de`, `/en` work directly)

## Demo users

All with the password `Meridian2026!` (set `DEMO_PASSWORD` in `strapi/.env` before seeding to change it; change it anyway before showing this outside Strapi).

| Email | Role | Use in the demo |
|---|---|---|
| admin@meridian-demo.test | Super Admin | Platform team, scene 6 |
| hq.editor@meridian-demo.test | HQ editor | Headquarters team, scenes 0 and 1 |
| it.editor@meridian-demo.test | Country editor IT | Italian country team, scenes 2, 3, 4 |
| fr.editor@meridian-demo.test | Country editor FR | |
| de.editor@meridian-demo.test | Country editor DE | |
| compliance@meridian-demo.test | Compliance reviewer | Compliance team, scenes 3, 4, 5 |

## What the seed leaves ready for the scenes

- `Motor Flex 2027`: English only, draft, stage Draft, outside any release. Scene 1 adds it to the "Motor Flex launch" release; scene 2 creates the Italian version.
- `Motor Essential` (Italian): live rate 6.9%, with a previous version at 4.9% in Content history and the change in the Audit log, both authored by the Italy editor. Scene 5 restores 4.9.
- `Home Secure` (Italian): a newer draft sitting in "Changes requested" with a review note from compliance. Shortcut for scene 3.
- Releases: "Motor Flex launch" (contains the press release, product added live), "Winter promo start" and "Winter promo end" (publish and unpublish the "Winter cover check" banner). Dates are relative to the seed date so they are always in the future.
- Two news items and one press release left in draft on purpose.

## Changing the content

The dataset lives in `strapi/data/demo/*.json` (one file per content type, all four languages) and `strapi/data/demo/media/`. Edit, then `yarn seed`. The content model lives in `strapi/src/api/*` and `strapi/src/components/*`; after a schema change, run `cd strapi && yarn strapi ts:generate-types` and reseed.

## Honesty notes

- Everything is fictional and placeholder. The regulatory wording and the PDFs are invented and say so. Never present them as real IVASS, ACPR or BaFin text.
- French, German and Italian copy has not had a native review yet.
- Routes linked from the navigation but outside the demo's scope (`/quote`, `/account`, `/careers`, `/documents`) show a placeholder page rather than a 404.
