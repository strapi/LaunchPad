# Implementation Plan: Hero Redesign

**Branch**: `feature/hero-redesign` | **Date**: 2024-05-22 | **Spec**: `specs/hero-redesign/spec.md`
**Input**: Feature specification from `specs/hero-redesign/spec.md`

## Execution Flow
1. **Load feature spec**: Confirmed.
2. **Fill Technical Context**: Next.js 15, React 19, Tailwind CSS.
3. **Constitution Check**: PASS.
4. **Phase 0**: Research complete.
5. **Phase 1**: Design & Contracts (N/A for UI-only change).
6. **Phase 2**: Task Planning.

## Technical Context
**Language**: TypeScript / React 19
**Framework**: Next.js 15 (App Router)
**Styling**: Tailwind CSS
**Animation**: Framer Motion
**Project Type**: Web Application

## Phase 0: Outline & Research
- **Target Files**:
    - `next/app/layout.tsx` (Cursor removal)
    - `next/components/ui/CustomCursor.tsx` (Delete)
    - `next/components/LandingIntro.tsx` (Replace/Refactor)
    - `next/components/HeroSection.tsx` (New Component)

## Phase 2: Task Planning Approach

### Task 1: Remove Custom Cursor
- **Action**: Delete `next/components/ui/CustomCursor.tsx`.
- **Action**: Remove import and usage of `<CustomCursor />` in `next/app/layout.tsx`.
- **Validation**: Verify system cursor appears on reload.

### Task 2: Create New Hero Component
- **Action**: Create `next/components/HeroSection.tsx`.
- **Details**: 
    - Implement Split Screen layout.
    - Use `framer-motion` for subtle entry animations (fade-in-up).
    - Hardcode copy from Spec.
    - Use `next/image` for the portrait placeholder.

### Task 3: Integrate Hero into Homepage
- **Action**: Update `next/app/[lang]/page.tsx`.
- **Action**: Replace `<LandingIntro />` with new `<HeroSection />`.

### Task 4: Cleanup
- **Action**: Delete `next/components/LandingIntro.tsx` and `ParticleHero`.
- **Action**: Verify responsive styles (Mobile/Tablet/Desktop).
