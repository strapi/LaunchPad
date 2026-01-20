/# 🏭 SMART SITE UPGRADE PLAN: Dr. Peter Sung (LaunchPad)

**Objective:** Transform the current "LaunchPad" demo into a production-ready, "Smart Site" for Dr. Peter Sung (Psychology/Public Speaker).
**Design Standard:** 9.5/10, Apple-grade polish, Steve g
---

## ✅ Phase 0: Immediate Fixes & Setup (The "Finish Today" Foundation)

- [ ] **Fix Vercel Build Error**: Investigate and resolve the issue in `TaskMonitor.tsx` (or related files) preventing deployment.
- [ ] **Environment Setup**: Run `yarn setup` to generate `.env` files for Next.js and Strapi.
- [ ] **Seed Data**: Run `yarn seed` to populate Strapi with initial content.
- [ ] **Verify Dev Server**: Ensure `yarn dev` runs both frontend and backend without crashing.

## 🎨 Phase 1: Design System & Aesthetics (The "Vibe Check")

- [ ] **Define Color Palette**:
  - **Light Mode**: "Warm Professional" (Cream/Warm White backgrounds, Forest Green/Terracotta accents). _No clinical white._
  - **Dark Mode**: "Relaxing Dark" (Warm Charcoal/Slate, not pure black). _No neon slop._
- [ ] **Typography Upgrade**:
  - Headlines: `Playfair Display` (Elegant, authoritative).
  - Body: `DM Sans` or `Inter` (Clean, readable).
- [ ] **Tailwind Configuration**: Update `tailwind.config.ts` and `globals.css` with semantic color variables (`--background`, `--foreground`, `--primary`, etc.) to support the new palette.

## 🧩 Phase 2: Component Architecture (The "Steve Krug" Audit)

- [ ] **Navigation Overhaul**:
  - Verify "Floating Dock" menu implementation.
  - Ensure "Mobile Sheet" navigation works perfectly on small screens.
- [ ] **Hero Section**:
  - Implement "Immersive Full-Page Hero" with subtle motion (Framer Motion).
  - Ensure clear "Value Proposition" for Dr. Sung immediately visible.
- [ ] **Project/Content Cards**:
  - Refactor into **Image-Driven Cards** with overlays (Awwwards style).
  - **Interaction**: Click opens a **Modal** (intercepting route) instead of a new page.
  - **Micro-interactions**: Smooth hover lift, blur-up image loading.
- [ ] **Dashboard (Client Area)**:
  - Apply "Semantic Colors" (Green=Success, Blue=Info, etc.) to stats.
  - Ensure it feels like a premium app, not a generic admin panel.

## 📝 Phase 3: Content & Copy (The "Dr. Sung" Voice)

- [ ] **Audit Existing Copy**: Remove generic "Lorem Ipsum" or "SaaS buzzwords".
- [ ] **Rewrite for Niche**: Focus on Psychology, Public Speaking, and "Pain Points".
- [ ] **i18n Setup**: Verify English/Spanish support (as requested in Smart Site prompts).

## ⚙️ Phase 4: Backend & "Smart" Features

- [ ] **BFF Implementation**: Ensure Next.js API routes properly proxy/aggregate requests to Strapi and AI Agents.
- [ ] **Database**: Configure Strapi to use **Postgres** (prepare `database.js` and `docker-compose.yml`).
- [ ] **AI Integration**:
  - Verify "Ghost Element" UI for AI generation states.
  - Ensure the "Infinite Canvas" can display AI-generated content.

## 🚀 Phase 5: Deployment & Polish

- [ ] **Dockerization**: Create/Update `Dockerfile` and `docker-compose.yml` for a portable "Docker Wrapper".
- [ ] **Performance Audit**: Run Lighthouse. Optimize images (`next/image`), reduce CLS.
- [ ] **Accessibility Check**: Ensure ARIA labels, keyboard navigation, and contrast ratios (WCAG AA).
- [ ] **Final Polish**: Smooth transitions, loading skeletons, favicon/meta tags.

---

## 📅 Today's Execution Order

1. **Fix Build** (`TaskMonitor.tsx`).
2. **Setup & Seed** (Get the app running).
3. **Design System Injection** (Colors/Fonts).
4. **Hero & Card Refactor** (High impact visual changes).
5. **Docker Wrap** (Ready for Hostinger).
