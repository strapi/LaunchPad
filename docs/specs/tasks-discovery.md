# Tasks — Discovery & Content Ingestion

## Context
Tasks derived from `spec-discovery.md`. Track progress for crawling, normalizing, and documenting legacy securebase.cc content.

## Task List

### 1. Prepare Tooling
- [ ] Bootstrap a Node.js crawler script with CLI flags for seed URLs, output directory, and concurrency controls.
- [ ] Add Markdown + frontmatter serializer utilities (likely using `gray-matter`).
- [ ] Configure local cache directories under `content/_imports/securebase`.

### 2. Crawl Legacy Site
- [ ] Execute crawl against `/`, `/about`, `/speaking`, `/coaching`, `/contact`, and auto-discover internal links.
- [ ] Capture HTTP status logs for each request and save to `content/_imports/securebase/crawl-log.json`.
- [ ] Detect and flag any blocked/forbidden URLs (403/401) for escalation.

### 3. Normalize Content
- [ ] Parse HTML into structured sections (meta, headings, body, testimonials, CTAs).
- [ ] Generate Markdown files with required frontmatter fields and relative asset references.
- [ ] Record timestamps (`lastFetched`) for each export.

### 4. Asset Management
- [ ] Download inline images and store under `content/_imports/securebase/images`.
- [ ] Maintain a manifest of image sources and license status for later attribution.
- [ ] Validate image references inside Markdown after download.

### 5. Reporting & QA
- [ ] Produce `content/_imports/securebase/SITEMAP.json` summarizing all pages and metadata.
- [ ] Draft `content/_imports/securebase/DISCOVERY.md` capturing themes, tone, CTAs, testimonials, and brand cues.
- [ ] Add automated tests (Jest) for HTML → Markdown conversions.
- [ ] Document known blockers (e.g., network restrictions) and fallback steps for manual ingestion.

### 6. Handoff
- [ ] Review outputs with stakeholders for completeness.
- [ ] Tag follow-up tasks for CMS seeding and IA workstreams.

## Status Legend
- ☐ Not started
- ⧖ In progress
- ☑ Complete
- ⚠ Blocked (requires attention)
