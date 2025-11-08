# Plan — Discovery & Content Ingestion

## Overview
This plan translates `spec-discovery.md` into phased execution with tooling choices, owners, and timelines. The objective is to secure a complete snapshot of securebase.cc content for migration into the Strapi v5 CMS.

## Phase 0 — Environment Setup
- **Owners**: Engineering
- **Steps**:
  1. Confirm Node.js ≥ 18 environment with network access to securebase.cc.
  2. Create workspace directories under `content/_imports/securebase` (markdown, images, logs).
  3. Install dependencies: `node-fetch`, `jsdom`, `gray-matter`, `turndown`, `p-limit`.
  4. Configure `.env` entries for rate limiting and optional basic auth (if provided).
- **Deliverables**: Initialized repository paths, dependency manifest, `.env.example` updates.

## Phase 1 — Crawl Execution
- **Owners**: Engineering
- **Steps**:
  1. Seed crawl with explicit routes: `/`, `/about`, `/speaking`, `/coaching`, `/contact`.
  2. Limit scope to `securebase.cc` host, ignoring external domains.
  3. Persist raw HTML responses for reproducibility (`raw/{slug}.html`).
  4. Log HTTP status codes, content-type, and response times.
  5. Handle network errors gracefully with retries and exponential backoff.
- **Deliverables**: `crawl-log.json`, raw HTML snapshots per page.

## Phase 2 — Normalization Pipeline
- **Owners**: Engineering + Content
- **Steps**:
  1. Parse HTML with JSDOM to extract metadata (title, description, headings, structured content blocks).
  2. Convert main body to Markdown using Turndown with custom rules for CTAs, blockquotes, and testimonials.
  3. Build frontmatter object per spec; include `sourceURL`, `lastFetched`, and `images` array.
  4. Write Markdown to `content/_imports/securebase/{slug}.md`.
  5. Store intermediate JSON for debugging (`structured/{slug}.json`).
- **Deliverables**: Markdown files with frontmatter, structured JSON snapshots.

## Phase 3 — Asset Handling
- **Owners**: Engineering
- **Steps**:
  1. Queue image downloads captured during normalization.
  2. Maintain `images-manifest.json` with source URL, local filename, alt text, checksum, and license status.
  3. Update Markdown image references to relative paths (e.g., `./images/{filename}`).
  4. Flag missing alt text for content follow-up.
- **Deliverables**: Downloaded images, manifest with license notes.

## Phase 4 — Reporting & QA
- **Owners**: Content Lead
- **Steps**:
  1. Compile `SITEMAP.json` containing slug, title, description, source URL, `lastFetched`, and asset counts.
  2. Draft `DISCOVERY.md` summarizing messaging pillars, offer structure, testimonials, CTAs, and tone of voice.
  3. Cross-check coverage against legacy navigation to ensure no pages missing.
  4. Present findings to stakeholders for validation and capture feedback.
- **Deliverables**: `SITEMAP.json`, `DISCOVERY.md`, stakeholder sign-off notes.

## Phase 5 — Blockers & Fallbacks
- **Scenario**: Direct crawl blocked (e.g., HTTP 403).
- **Fallback Steps**:
  1. Notify stakeholders and request zipped HTML export (as indicated in the master prompt patch attachment).
  2. Import provided archive into `content/_imports/securebase/raw` and rerun normalization pipeline against local files.
  3. Document the blocker and resolution within `DISCOVERY.md` and the crawl log.
- **Deliverables**: Updated documentation referencing alternative data source.

## Tooling & Automation Notes
- Build CLI entry point `scripts/crawl-securebase.mjs` for reruns.
- Consider storing hashed outputs to avoid reprocessing unchanged pages.
- Ensure scripts exit non-zero on critical failures to integrate with CI later.

## Risks & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Network restrictions (403) | High | Use provided patch archive or coordinate with stakeholders for access credentials. |
| Dynamic content requiring JS | Medium | Enable headless browser fallback using Playwright if static HTML lacks required sections. |
| Licensing uncertainty for images | Medium | Track source and mark `NEEDS REVIEW` in manifest; consult legal. |
| Time drift between crawls | Low | Include `lastFetched` and plan for delta updates if the site changes. |

## Timeline (T-shirt sizes)
- Phase 0: S (0.5 day)
- Phase 1: M (1 day)
- Phase 2: M (1 day)
- Phase 3: S (0.5 day)
- Phase 4: S (0.5 day)
- Phase 5: Contingency (as needed)

## Next Steps
- Finalize tooling selection and begin implementation per Task list.
- Coordinate with stakeholders about access limitations noted in Phase 5.
