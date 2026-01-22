# IMPLEMENTATION PLAN - DESIGN IMPROVEMENTS

**Status:** Ready to implement
**Total Estimated Time:** 2-3 hours
**Target Score:** 9.5/10 (from 8.2/10)

---

## PHASE 1: CRITICAL FIXES (1-2 hours)

### Fix 1: Increase Button Touch Targets to 44×44px
**Files:**
- `next/components/ui/toggle.tsx`
- `next/components/ui/button.tsx`
- `next/components/elements/button.tsx`

**Changes:**
- Update toggle sizes: sm→40px, default→44px, lg→48px
- Verify all button variants meet minimum
- Add padding adjustments if needed

### Fix 2: Add prefers-reduced-motion Support
**Files:**
- `next/app/globals.css`
- `next/tailwind.config.ts`

**Changes:**
- Add @media query for reduced motion
- Disable animations when preference set
- Test with browser accessibility settings

### Fix 3: Create Z-Index Scale
**Files:**
- `next/tailwind.config.ts`

**Changes:**
- Define centralized z-index values
- Update all components to use new scale
- Document in component README

---

## PHASE 2: HIGH-PRIORITY FIXES (1-2 hours)

### Fix 4: Add WebP/AVIF Image Formats
**Files:**
- `next/next.config.mjs`
- `next/components/blur-image.tsx`

**Changes:**
- Add formats array to next.config
- Verify Image components use new formats
- Test image loading in different browsers

### Fix 5: Add 375px Mobile Breakpoint
**Files:**
- `next/tailwind.config.ts`

**Changes:**
- Add xs: 375px breakpoint
- Test all pages at 375px width
- Update responsive classes where needed

### Fix 6: Add Contrast Validation
**Files:**
- Create `.eslintrc.json` rules
- `package.json` - Add script

**Changes:**
- Add ESLint color contrast rule
- Add pre-commit hook
- Test validation in CI/CD

---

## IMPLEMENTATION CHECKLIST

- [ ] Phase 1: Fix 1 - Touch Targets
- [ ] Phase 1: Fix 2 - Reduced Motion
- [ ] Phase 1: Fix 3 - Z-Index Scale
- [ ] Phase 2: Fix 4 - WebP Formats
- [ ] Phase 2: Fix 5 - 375px Breakpoint
- [ ] Phase 2: Fix 6 - Contrast Validation
- [ ] Testing: All pages on 375px, 768px, 1024px, 1440px
- [ ] Testing: Reduced motion enabled
- [ ] Testing: Keyboard navigation
- [ ] Testing: Mobile touch targets
- [ ] Documentation: Update component library
- [ ] Commit: All changes to git
- [ ] Push: To github
- [ ] Deploy: To production

---

## START IMPLEMENTATION NOW
