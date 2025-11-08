# Plan — SYNTHIA Prompt Integration

## Overview
Operational roadmap for implementing `spec-design-upgrade.md`. Defines phases, owners, and deliverables to publish the SYNTHIA system prompt and embed it within design workflows.

## Phase 0 — Alignment & Discovery
- **Owners**: Design Lead, Product Lead
- **Steps**:
  1. Review master project prompt and existing discovery documentation for tone, messaging, and accessibility requirements.
  2. Gather stakeholder expectations for AI-assisted design collaboration (design, engineering, content, automation).
  3. Confirm intended distribution channels (Spec Kit references, onboarding docs, automation scripts).
- **Deliverables**: Alignment notes summarizing design priorities and behavioral goals.

## Phase 1 — Prompt Drafting
- **Owners**: Design Systems Lead, UX Writer
- **Steps**:
  1. Customize GOD-TIER DESIGN AGENT SYSTEM PROMPT v2.0 sections for Peter Sung project specifics (Stack, goals, KPIs).
  2. Incorporate brand considerations from discovery (tone, service offerings, testimonials).
  3. Emphasize implementation stack: Strapi v5, Next.js 15 App Router, Tailwind, shadcn/ui, GraphQL SDK, Playwright tests.
  4. Embed success metrics, accessibility requirements (WCAG 2.2 AA), and SEO expectations (JSON-LD, Core Web Vitals).
- **Deliverables**: Draft prompt with metadata stored locally for review.

## Phase 2 — Review & Validation
- **Owners**: Design Review Board, Engineering Lead
- **Steps**:
  1. Conduct collaborative review session to vet behavioral heuristics, technical guardrails, and ethical statements.
  2. Ensure prompt references Spec Kit usage and connection points to future specs (page builder, blog, videos, SEO).
  3. Capture feedback, iterate wording, and confirm alignment with legal/ethical standards.
- **Deliverables**: Reviewed prompt, feedback log, approval sign-off.

## Phase 3 — Publication & Adoption
- **Owners**: Documentation Lead, Developer Experience
- **Steps**:
  1. Publish final prompt to `docs/prompts/god-tier-design-agent-system-prompt-v2.md` with version metadata.
  2. Update onboarding docs (e.g., README roadmap) to reference the prompt for design-related tasks.
  3. Communicate availability to the team via release notes or Slack/Teams update.
- **Deliverables**: Published prompt, updated documentation references, announcement copy.

## Phase 4 — Governance & Continuous Improvement
- **Owners**: Design Ops, Automation Lead
- **Steps**:
  1. Define change management process (versioning scheme, review requirements, approval flow).
  2. Schedule recurring evaluations (e.g., per milestone) to assess prompt efficacy.
  3. Log future enhancements (integration with MCP, automated compliance checks).
- **Deliverables**: Governance checklist, backlog of follow-up improvements.

## Risks & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Prompt becomes outdated as design system evolves | High | Establish review cadence and change log tracking. |
| Overly prescriptive instructions hinder creativity | Medium | Include guidance on flexibility and experimentation scope. |
| Lack of adoption by contributors | Medium | Provide training, integrate references into specs/tasks, and monitor usage. |
| Ethical guidelines conflict with business requests | Low | Escalate to leadership, maintain documented rationale, prioritize user well-being. |

## Timeline (T-shirt sizes)
- Phase 0: S (0.5 day)
- Phase 1: M (1 day)
- Phase 2: S (0.5 day)
- Phase 3: S (0.5 day)
- Phase 4: Ongoing (governance)

## Next Steps
- Kick off Phase 0 alignment session and confirm owners.
- Begin drafting prompt following the outlined structure.
