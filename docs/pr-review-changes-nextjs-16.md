# PR Review Changes - Next.js 16 Migration

This document summarizes the changes made based on PR review feedback for the Next.js 16 migration.

---

## 1. Missing `loading.tsx` Files

**Reviewer:** @fonodi
**Issue:** Documentation stated that `loading.tsx` files should be added for multiple routes (blog, blog/[slug], products, products/[slug], [slug]), but only `blog/[slug]/loading.tsx` was implemented.

### Changes Made

Created the missing `loading.tsx` files with appropriate skeleton UIs:

| File | Description |
|------|-------------|
| `app/[locale]/(marketing)/blog/loading.tsx` | Blog list skeleton (6-card grid) |
| `app/[locale]/(marketing)/blog/[slug]/loading.tsx` | Blog post skeleton (title, meta, image, content) |
| `app/[locale]/(marketing)/products/loading.tsx` | Products list skeleton (8-card grid) |
| `app/[locale]/(marketing)/products/[slug]/loading.tsx` | Product detail skeleton (image + details grid) |
| `app/[locale]/(marketing)/[slug]/loading.tsx` | Generic page skeleton (title + content lines) |

Each skeleton matches the layout of its corresponding page for a smooth loading experience.

---

## 2. Redundant Suspense Boundaries

**Reviewer:** @fonodi
**Issue:** The documentation showed wrapping `{children}` in `<Suspense>` within layouts, but `loading.tsx` files already create Suspense boundaries automatically. This is redundant.

### Explanation

Next.js automatically wraps page content in a `<Suspense>` boundary when a `loading.tsx` file exists in that route segment. The `loading.tsx` component becomes the fallback.

**When you need explicit `<Suspense>`:**
- Async components in layouts that are NOT pages (e.g., `NavbarWrapper`, `FooterWrapper`)

**When you do NOT need explicit `<Suspense>`:**
- Around `{children}` in layouts, if routes have `loading.tsx` files

### Changes Made

Updated `docs/nextjs-16-suspense-architecture.md`:

1. **Architecture diagram** - Shows `{children}` without Suspense wrapper
2. **Key Principles** - Added principle about not duplicating boundaries
3. **Locale layout example** - Removed `<Suspense>` around `{children}` and `PageLoading` component
4. **Migration checklist** - Changed to "Do NOT wrap `{children}` in Suspense"
5. **Common Mistakes** - Added new section (#5) warning against redundant Suspense

### Before

```tsx
// Locale layout - REDUNDANT
<Suspense fallback={<NavbarSkeleton />}>
  <NavbarWrapper locale={locale} />
</Suspense>

<Suspense fallback={<PageLoading />}>
  {children}  {/* Unnecessary! */}
</Suspense>

<Suspense fallback={<FooterSkeleton />}>
  <FooterWrapper locale={locale} />
</Suspense>
```

### After

```tsx
// Locale layout - CORRECT
<Suspense fallback={<NavbarSkeleton />}>
  <NavbarWrapper locale={locale} />
</Suspense>

{children}  {/* loading.tsx handles this */}

<Suspense fallback={<FooterSkeleton />}>
  <FooterWrapper locale={locale} />
</Suspense>
```

---

## 3. Unsafe Spread Pattern

**Reviewer:** @fonodi
**Issue:** Using `...(condition && {...})` spreads `false` when the condition is falsy. While JavaScript handles this as a no-op, it's not semantically correct and could cause issues.

### Explanation

```javascript
// When NODE_ENV !== 'development':
...(process.env.NODE_ENV === 'development' && { unoptimized: true })
// Becomes:
...(false)  // Spreads false - works but semantically incorrect

// Better approach:
...(process.env.NODE_ENV === 'development' ? { unoptimized: true } : {})
// Becomes:
...({})  // Spreads empty object - semantically correct
```

### Changes Made

**File:** `next/next.config.mjs`

```diff
- ...(process.env.NODE_ENV === 'development' && {
-   unoptimized: true,
- }),
+ ...(process.env.NODE_ENV === 'development' ? { unoptimized: true } : {}),
```

**File:** `next/components/dynamic-zone/hero.tsx`

```diff
- {...(cta.variant && { variant: cta.variant })}
+ {...(cta.variant ? { variant: cta.variant } : {})}
```

---

## Summary

| Issue | Files Changed |
|-------|---------------|
| Missing loading.tsx files | 5 files created |
| Redundant Suspense documentation | `docs/nextjs-16-suspense-architecture.md` |
| Unsafe spread pattern | `next/next.config.mjs`, `next/components/dynamic-zone/hero.tsx` |
