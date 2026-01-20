# Discovery Spec — Legacy Content Ingestion

## Summary
Document the approach for cataloging and importing legacy content from securebase.cc into the new Peter Sung monorepo. This spec focuses on building a repeatable pipeline that captures HTML, assets, and metadata, then normalizes them into Markdown and structured data for downstream Strapi seeding.

## Goals
- Enumerate all relevant public pages on securebase.cc and persist a sitemap snapshot.
- Normalize page content into Markdown with consistent frontmatter for provenance and later block mapping.
- Download referenced assets with license provenance preserved.
- Produce analytical notes (`DISCOVERY.md`) capturing themes, tone, and CTA patterns to inform IA and design decisions.

## Non-Goals
- Building Strapi content types (covered in `spec-cms-model`).
- Implementing automated Strapi imports (handled separately once CMS schemas exist).
- Validating SEO performance of the legacy site.

## Users & Stakeholders
- **Content team** — needs reliable markdown exports for copy editing.
- **Engineering** — requires structured data and asset paths for seeding Strapi and Next.js fixtures.
- **Design** — benefits from qualitative insights regarding tone, imagery, and hierarchy.

## Dependencies
- Network access to securebase.cc pages or equivalent offline dumps supplied by stakeholders.
- Local storage for downloaded HTML/markdown and assets under `content/_imports/securebase`.
- Node.js tooling for crawling and parsing.

## Assumptions
- securebase.cc remains reachable. If direct access is blocked (403), stakeholders will provide ZIP archives of the captured content.
- Legacy URLs are stable enough to derive slugs (fall back to provided sitemap if necessary).
- Downloaded assets can be redistributed under existing licensing; otherwise they are flagged for review.

## Functional Requirements
1. Crawl the entry points: `/`, `/about`, `/speaking`, `/coaching`, `/contact`, and recursively discover child links within the same domain.
2. For each page, extract:
   - `<title>` and meta description.
   - H1–H3 headings and body copy, preserving emphasis and links where practical.
   - Inline images with alt text and absolute URLs.
3. Convert each page to Markdown with frontmatter fields:
   ```yaml
   title: string
   description: string
   slug: string
   sourceURL: string
   images: [{ src: string, alt: string }]
   lastFetched: ISO8601 string
   ```
4. Store Markdown files at `content/_imports/securebase/{slug}.md`.
5. Download each referenced image into `content/_imports/securebase/images/{filename}` and update Markdown references to use relative paths.
6. Generate `content/_imports/securebase/SITEMAP.json` summarizing discovered routes, titles, descriptions, and asset counts.
7. Summarize qualitative findings in `content/_imports/securebase/DISCOVERY.md` (themes, CTAs, testimonials, tone).

## Acceptance Criteria
- ✅ Markdown exists for every discovered page with populated frontmatter and relative image references.
- ✅ `SITEMAP.json` enumerates all crawled pages with metadata timestamps.
- ✅ `DISCOVERY.md` synthesizes qualitative insights and highlights notable CTAs/testimonials.
- ✅ Assets are downloaded locally and referenced without external URLs.
- ✅ Script(s) are repeatable and idempotent, enabling re-run without duplicating assets.
- ✅ If crawling is blocked, documentation captures the blocker and references stakeholder-supplied archives.

## Observability & QA
- Provide a crawl log summarizing HTTP status codes per URL.
- Include a checksum or file count validation step in the ingestion script.
- Add automated unit tests for Markdown normalization helpers where feasible.

## Open Questions
- Are there protected pages (e.g., gated downloads) that require credentials?
- What is the authoritative list of legacy redirects to maintain?
- Are there non-HTML assets (PDFs, videos) requiring special handling?

## Out of Scope
- YouTube inventory (covered in `spec-videos`).
- Sitemap design for the new site (covered in `spec-cms-model` and IA documentation).

## References
- Master prompt requirements (Part 1 — Discovery & Content Ingestion).
- securebase.cc legacy site.
- Spec Kit template guidelines.
