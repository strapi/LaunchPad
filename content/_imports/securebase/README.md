# securebase.cc Import Workspace

This directory will contain crawled markdown, assets, and reports sourced from the legacy securebase.cc site.

## Expected Structure
- `SITEMAP.json` — machine-readable summary of discovered pages.
- `DISCOVERY.md` — qualitative observations (tone, CTAs, testimonials).
- `images/` — downloaded images referenced by markdown files.
- `{slug}.md` — markdown files per crawled page with frontmatter.
- `raw/` — optional raw HTML snapshots for reproducibility.
- `logs/` — crawl logs, HTTP status data, and checksum reports.

The workspace is currently empty pending completion of the discovery crawl described in `docs/specs/spec-discovery.md`.
