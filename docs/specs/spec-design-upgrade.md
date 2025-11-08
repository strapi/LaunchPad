# Design Upgrade Spec — SYNTHIA Prompt Integration

## Summary
Establish a comprehensive system prompt for the "SYNTHIA" design agent that will guide future UI/UX upgrades to the Peter Sung website. The prompt must synthesize behavioral psychology, accessibility, and implementation guardrails so downstream contributors can deliver consistent, high-quality design enhancements.

## Goals
- Author a reusable system prompt that codifies the desired voice, objectives, and guardrails for design-focused AI collaborators.
- Capture behavioral, psychological, and technical principles that must inform any design upgrade workstreams.
- Define integration points so the prompt can be referenced from future specs, design reviews, or automation pipelines.
- Document success criteria ensuring the prompt remains actionable, auditable, and aligned with the master project brief.

## Non-Goals
- Implementing specific UI changes or visual assets (covered by future feature specs).
- Automating prompt execution within CI/CD or MCP tooling (to be scoped separately).
- Replacing human review—prompt acts as augmentation, not a standalone authority.

## Users & Stakeholders
- **Design Leads** — leverage the prompt to brief AI tools and ensure stylistic alignment.
- **Frontend Engineers** — reference behavioral heuristics and implementation guidelines when translating designs into code.
- **Content Strategists** — align messaging and tone with design behaviors outlined in the prompt.
- **Automation/MCP Owners** — embed the prompt into future agent workflows.

## Dependencies
- Master prompt requirements outlining design and accessibility expectations.
- Existing discovery insights about brand tone and content themes.
- Spec Kit templates for documentation consistency.

## Assumptions
- Future design upgrades will rely on AI-assisted workflows where a strong system prompt provides leverage.
- Stakeholders accept the SYNTHIA persona and objectives as the canonical framing for design automation.
- The prompt will evolve; versioning must be straightforward.

## Functional Requirements
1. Draft a structured system prompt following the provided GOD-TIER DESIGN AGENT SYSTEM PROMPT v2.0 outline.
2. Tailor sections to Peter Sung's project context, referencing relevant tooling (Strapi, Next.js, Tailwind, shadcn/ui).
3. Ensure the prompt clearly enumerates:
   - Behavioral psychology principles and success metrics.
   - Visual and interaction design heuristics.
   - Implementation expectations (TypeScript, accessibility, performance).
   - Ethical constraints and continuous improvement guidance.
4. Store the prompt in a discoverable repository location (`docs/prompts/`).
5. Provide metadata (version, last updated, author) for traceability.
6. Document how future contributors should apply or update the prompt.

## Acceptance Criteria
- ✅ `docs/prompts/` contains a Markdown file with the finalized SYNTHIA system prompt tailored to Peter Sung's redesign.
- ✅ Prompt includes project-specific implementation hooks (Strapi schemas, Next.js 15, Tailwind design system) and behavioral heuristics.
- ✅ Spec Kit artifacts (tasks + plan) outline maintenance, distribution, and adoption steps.
- ✅ Documentation references how to embed the prompt into upcoming design upgrade workflows.
- ✅ Version metadata present at top of prompt file.

## Observability & QA
- Conduct peer review (design + engineering) to validate completeness and applicability.
- Maintain changelog entries when prompt revisions occur (tracked via git history or future `CHANGELOG`).
- Periodically audit prompt usage in future specs to ensure alignment.

## Open Questions
- Should the prompt include automated validation checklists for PR reviews?
- Do we need localized variants of the prompt for different contributor roles?
- What cadence should govern prompt updates (per release, quarterly)?

## Out of Scope
- Building UI prototypes or visual assets.
- Integrating MCP automation flows.
- Enforcing prompt usage via tooling.

## References
- Master project prompt (Design upgrade + GOD-TIER DESIGN AGENT SYSTEM PROMPT v2.0).
- Spec Kit guidelines under `/docs/specs`.
- Existing discovery documentation (`content/_imports/securebase`).
