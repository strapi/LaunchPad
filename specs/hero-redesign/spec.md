# Feature Specification: Hero Redesign & Cursor Removal

**Feature**: Site Overhaul - Phase 1 (Hero & UX)
**Status**: Implemented
**Priority**: High

## 1. Overview
Redesign the homepage Hero section to align with the "SecureBase" brand identity and remove the custom cursor to improve usability. The new design focuses on clarity, authority, and a grounded aesthetic, moving away from the previous "particle" effects.

## 2. User Stories
- **As a user**, I want a standard system cursor so that navigation feels familiar and precise.
- **As a visitor**, I want to immediately understand the value proposition ("Lead with Clarity") without visual distraction.
- **As a mobile user**, I want a responsive layout that stacks content legibly.

## 3. Functional Requirements
### 3.1. Cursor
- **REQ-1**: Remove `CustomCursor` component entirely.
- **REQ-2**: Ensure standard pointer events work across all interactive elements.

### 3.2. Hero Section
- **REQ-3**: Implement a "Split Screen" layout on Desktop (Text Left / Image Right).
- **REQ-4**: Implement a "Stacked" layout on Mobile (Image Top / Text Bottom).
- **REQ-5**: Display the following copy:
    - Eyebrow: "For Leaders Who Carry the Weight"
    - Headline: "Lead with Clarity. Anchor in Safety."
    - Subhead: "Executive coaching that combines organizational psychology..."
    - CTAs: "Start Your Discovery" (Primary) and "Explore the Framework" (Secondary).
    - Trust Indicators: "30+ Years Experience", "500+ Leaders Coached".

## 4. Design Tokens
- **Fonts**: Inter (Body), Newsreader (Serif/Headings).
- **Colors**: 
    - Background: White / Charcoal (Dark Mode)
    - Text: Neutral-900 / Text-Primary
    - Accent: Cyan-500 (subtle usage)

## 5. Non-Functional Requirements
- **Performance**: LCP (Largest Contentful Paint) < 2.5s.
- **Accessibility**: Ensure sufficient color contrast for all text.
