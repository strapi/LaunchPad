# Handoff Prompt for Haiku Model

## Context
You are taking over a Next.js 15 + Strapi project that is 90% complete. The previous model successfully deployed to Vercel but the last build failed (Exit Code 1). Your job is to fix the build error, verify deployment, and complete final testing.

## What's Already Done ✅
1. **ParticleHero 3D component** - Fully built at `next/components/ParticleHero/ParticleHero.tsx`
2. **LandingIntro wrapper** - Integrated at `next/components/LandingIntro.tsx`
3. **Homepage integration** - ParticleHero wraps all content in `next/app/[locale]/(marketing)/page.tsx`
4. **LemonAI API route** - Created at `next/app/api/agent/process/route.ts`
5. **LemonAI Widget backend connection** - Updated at `next/components/dashboard/LemonAgentWidget.tsx`
6. **Fonts configured** - Cinzel already imported in layout.tsx
7. **First deployment succeeded** - Live at https://peter-sung-executiveusas-projects.vercel.app

## Current Problem ❌
**Build failed with Exit Code 1** on last rebuild attempt in `next/` directory.

## Your Tasks (In Order)

### Task 1: Fix Build Error (CRITICAL)
```bash
cd next
npm run build
```
**Expected issue:** Likely one of these:
- TypeScript error in new API route (`app/api/agent/process/route.ts`)
- Missing import in `LemonAgentWidget.tsx`
- Dependency conflict (already using --legacy-peer-deps)

**Action:** Read the build error output, fix the exact issue, rebuild until successful.

### Task 2: Redeploy to Vercel
```bash
cd next
vercel --prod
```
**Verify:** Deployment succeeds and returns a URL.

### Task 3: Verify ParticleHero on Live Site
**Action:** Open the deployed URL in browser OR use fetch to check if `<canvas>` element exists in HTML (ParticleHero uses Three.js canvas).

**Expected:** 
- 3D particle shield animation plays on homepage load
- After 2 seconds, particles disperse and main content fades in
- No console errors related to Three.js

### Task 4: Commit Changes
```bash
git add .
git commit -m "Fix: Build errors and complete LemonAI integration"
git push origin main
```

## Key File Locations
- **API Route:** `next/app/api/agent/process/route.ts`
- **Widget:** `next/components/dashboard/LemonAgentWidget.tsx`
- **ParticleHero:** `next/components/ParticleHero/ParticleHero.tsx`
- **Homepage:** `next/app/[locale]/(marketing)/page.tsx`
- **Build config:** `next/package.json` (uses --legacy-peer-deps)

## Environment
- **Node:** v25.2.1
- **Next.js:** 16.0.3 (Turbopack)
- **React:** 19.1.1
- **Vercel CLI:** Installed and logged in
- **Working directory:** `C:\Users\Trevor\OneDrive\One Drive Total Dump\Srpski\PETER SUNG BUILD\peter-sung`

## Success Criteria
1. ✅ `npm run build` completes with exit code 0
2. ✅ `vercel --prod` deploys successfully
3. ✅ Live site shows 3D ParticleHero animation
4. ✅ Changes committed to git

## Commands Reference
```bash
# Fix build (run from peter-sung/next)
npm run build

# Deploy (run from peter-sung/next)
vercel --prod

# Commit (run from peter-sung root)
git add .
git commit -m "Fix: Build errors and deploy ParticleHero"
git push origin main
```

## Notes
- **Don't refactor** - Just fix build errors
- **Don't optimize** - Just make it work
- **Don't test everything** - Just verify ParticleHero loads
- **Be surgical** - Fix only what's broken

## If You Get Stuck
1. Check terminal output for exact error message
2. Read the failing file's imports and types
3. Verify `@ai-sdk/google` is installed (it is)
4. Check if Google AI key is in .env (it should be)

**Start with Task 1. Read the build error output first.**
