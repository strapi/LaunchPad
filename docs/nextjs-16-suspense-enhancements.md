# Next.js 16 Suspense Enhancements (Optional)

This document covers **optional enhancements** to improve loading UX with more granular Suspense boundaries. These changes are not required - your app works without them - but they can improve perceived performance and user experience.

## Current State

Your app already has the minimum Suspense setup required for `cacheComponents: true`:

```
app/layout.tsx
└── <SlugProvider>
    └── <Suspense fallback={<RootLoading />}>  ✅ Done
        └── {children}
```

This is sufficient for the build to pass and caching to work.

---

## When to Add More Suspense Boundaries

Consider adding enhancements when you notice:

| Symptom | Solution |
|---------|----------|
| Entire page shows loading spinner for slow sections | Add section-level Suspense |
| Navigation feels slow on dynamic routes | Add `loading.tsx` files |
| Header/Footer flicker during navigation | Add wrapper components with Suspense |
| Users complain about "blank page" during loads | Add skeleton components |

---

## Enhancement 1: Loading Files for Dynamic Routes

**Priority: High** - Simple to add, immediate UX improvement

### What It Does

A `loading.tsx` file creates an automatic Suspense boundary for its route segment. Users see a loading skeleton instead of a blank page during navigation.

### Routes That Benefit

```
app/[locale]/(marketing)/
├── blog/
│   ├── loading.tsx         ← Add this
│   └── [slug]/
│       └── loading.tsx     ✅ Already exists
├── products/
│   ├── loading.tsx         ← Add this
│   └── [slug]/
│       └── loading.tsx     ← Add this
└── [slug]/
    └── loading.tsx         ← Add this
```

### Implementation

**File:** `app/[locale]/(marketing)/blog/loading.tsx`

```typescript
export default function BlogListLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page title skeleton */}
      <div className="h-10 bg-gray-700/50 rounded w-48 mb-8 animate-pulse" />

      {/* Article grid skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <article key={i} className="space-y-4 animate-pulse">
            <div className="aspect-video bg-gray-700/50 rounded-lg" />
            <div className="h-6 bg-gray-700/50 rounded w-3/4" />
            <div className="h-4 bg-gray-700/50 rounded w-1/2" />
          </article>
        ))}
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/products/loading.tsx`

```typescript
export default function ProductsListLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page title skeleton */}
      <div className="h-10 bg-gray-700/50 rounded w-48 mb-8 animate-pulse" />

      {/* Product grid skeleton */}
      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-square bg-gray-700/50 rounded-lg" />
            <div className="h-5 bg-gray-700/50 rounded w-3/4" />
            <div className="h-4 bg-gray-700/50 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/products/[slug]/loading.tsx`

```typescript
export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product image skeleton */}
        <div className="aspect-square bg-gray-700/50 rounded-lg animate-pulse" />

        {/* Product details skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-700/50 rounded w-3/4 animate-pulse" />
          <div className="h-8 bg-gray-700/50 rounded w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700/50 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-gray-700/50 rounded w-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/[slug]/loading.tsx`

```typescript
export default function DynamicPageLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Page title skeleton */}
      <div className="h-12 bg-gray-700/50 rounded w-2/3 mb-8 animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700/50 rounded animate-pulse"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Enhancement 2: Navbar/Footer Wrapper Components

**Priority: Medium** - Useful if header/footer have slow data fetches

### What It Does

Isolates Navbar and Footer data fetching so they can load independently from page content. Prevents slow global data from blocking page rendering.

### Current Architecture

```typescript
// app/[locale]/layout.tsx - Current
export default async function LocaleLayout({ children, params }) {
  const pageData = await fetchSingleType('global');  // ← Blocks everything

  return (
    <div>
      <Navbar data={pageData.navbar} />
      {children}
      <Footer data={pageData.footer} />
    </div>
  );
}
```

**Problem:** If `fetchSingleType('global')` is slow, the entire page waits.

### Enhanced Architecture

```
LocaleLayout
├── <Suspense fallback={<NavbarSkeleton />}>
│   └── <NavbarWrapper />  ← Fetches its own data
├── <Suspense fallback={<PageLoading />}>
│   └── {children}
└── <Suspense fallback={<FooterSkeleton />}>
    └── <FooterWrapper />  ← Fetches its own data
```

### Implementation

**File:** `components/navbar-wrapper.tsx` (NEW)

```typescript
import { Navbar } from './navbar';
import { fetchSingleType } from '@/lib/strapi';

interface NavbarWrapperProps {
  locale: string;
}

export async function NavbarWrapper({ locale }: NavbarWrapperProps) {
  const pageData = await fetchSingleType('global', { locale });
  return <Navbar data={pageData.navbar} locale={locale} />;
}
```

**File:** `components/footer-wrapper.tsx` (NEW)

```typescript
import { Footer } from './footer';
import { fetchSingleType } from '@/lib/strapi';

interface FooterWrapperProps {
  locale: string;
}

export async function FooterWrapper({ locale }: FooterWrapperProps) {
  const pageData = await fetchSingleType('global', { locale });
  return <Footer data={pageData.footer} locale={locale} />;
}
```

**File:** `components/skeletons/navbar-skeleton.tsx` (NEW)

```typescript
export function NavbarSkeleton() {
  return (
    <nav className="h-16 bg-charcoal border-b border-gray-800">
      <div className="container mx-auto px-4 h-full flex items-center">
        {/* Logo skeleton */}
        <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse" />

        {/* Nav links skeleton */}
        <div className="ml-auto flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  );
}
```

**File:** `components/skeletons/footer-skeleton.tsx` (NEW)

```typescript
export function FooterSkeleton() {
  return (
    <footer className="bg-charcoal border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-24 bg-gray-700/50 rounded animate-pulse" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

**File:** `app/[locale]/layout.tsx` (UPDATED)

```typescript
import { Suspense } from 'react';
import { draftMode } from 'next/headers';

import { DraftModeBanner } from '@/components/draft-mode-banner';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { FooterWrapper } from '@/components/footer-wrapper';
import { NavbarSkeleton } from '@/components/skeletons/navbar-skeleton';
import { FooterSkeleton } from '@/components/skeletons/footer-skeleton';
import { CartProvider } from '@/context/cart-context';

function PageLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <CartProvider>
      <div className="bg-charcoal antialiased min-h-screen flex flex-col">
        {/* Navbar loads independently */}
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarWrapper locale={locale} />
        </Suspense>

        {/* Page content loads independently */}
        <main className="flex-1">
          <Suspense fallback={<PageLoading />}>
            {children}
          </Suspense>
        </main>

        {/* Footer loads independently */}
        <Suspense fallback={<FooterSkeleton />}>
          <FooterWrapper locale={locale} />
        </Suspense>

        {isDraftMode && <DraftModeBanner />}
      </div>
    </CartProvider>
  );
}
```

---

## Enhancement 3: Page-Level Section Suspense

**Priority: Low** - For complex pages with multiple independent data sources

### What It Does

Allows different sections of a page to load in parallel. Users see content as soon as each section is ready.

### When to Use

- Homepage with multiple content sections (hero, featured articles, products)
- Dashboard pages with multiple widgets
- Any page where sections fetch different data

### Implementation Example

**File:** `app/[locale]/(marketing)/page.tsx`

```typescript
import { Suspense } from 'react';

// Async components that fetch their own data
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedArticles } from '@/components/sections/featured-articles';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { Testimonials } from '@/components/sections/testimonials';

// Skeleton components
function ArticlesSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-video bg-gray-700/50 rounded-lg" />
              <div className="h-6 bg-gray-700/50 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square bg-gray-700/50 rounded-lg" />
              <div className="h-5 bg-gray-700/50 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-8 mx-auto animate-pulse" />
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-800/50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-700/50 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-4" />
              <div className="h-4 bg-gray-700/50 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <>
      {/* Hero is typically fast/static - may not need Suspense */}
      <HeroSection locale={locale} />

      {/* Each section loads independently */}
      <Suspense fallback={<ArticlesSkeleton />}>
        <FeaturedArticles locale={locale} />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts locale={locale} />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials locale={locale} />
      </Suspense>
    </>
  );
}
```

**File:** `components/sections/featured-articles.tsx` (Example async component)

```typescript
import { fetchCollectionType } from '@/lib/strapi';
import { ArticleCard } from '@/components/article-card';

interface FeaturedArticlesProps {
  locale: string;
}

export async function FeaturedArticles({ locale }: FeaturedArticlesProps) {
  const articles = await fetchCollectionType('articles', {
    locale,
    pagination: { limit: 3 },
    sort: ['publishedAt:desc'],
  });

  if (!articles.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Enhancement 4: Reusable Skeleton Components

**Priority: Low** - For consistency and maintainability

### What It Does

Creates a library of reusable skeleton components that match your design system.

### Implementation

**File:** `components/skeletons/index.tsx`

```typescript
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Base skeleton element
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-700/50 rounded animate-pulse',
        className
      )}
    />
  );
}

// Text line skeleton
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

// Heading skeleton
export function SkeletonHeading({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-8 w-3/4', className)} />;
}

// Image skeleton
export function SkeletonImage({ className }: SkeletonProps) {
  return <Skeleton className={cn('aspect-video w-full', className)} />;
}

// Avatar skeleton
export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />;
}

// Button skeleton
export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-24', className)} />;
}

// Card skeleton
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <SkeletonImage />
      <SkeletonHeading className="w-3/4" />
      <SkeletonText className="w-1/2" />
    </div>
  );
}

// Article card skeleton
export function SkeletonArticleCard() {
  return (
    <article className="space-y-4 animate-pulse">
      <Skeleton className="aspect-video rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </article>
  );
}

// Product card skeleton
export function SkeletonProductCard() {
  return (
    <div className="space-y-3 animate-pulse">
      <Skeleton className="aspect-square rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
```

### Usage

```typescript
import {
  SkeletonArticleCard,
  SkeletonProductCard,
  SkeletonHeading,
} from '@/components/skeletons';

function ArticleListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <SkeletonHeading className="mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <SkeletonArticleCard key={i} />
        ))}
      </div>
    </div>
  );
}
```

---

## Implementation Order

If you decide to implement these enhancements, here's the recommended order:

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION ORDER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: Quick Wins (1-2 hours)                                │
│  └─ Add loading.tsx files for dynamic routes                    │
│     ├─ /blog/loading.tsx                                        │
│     ├─ /products/loading.tsx                                    │
│     ├─ /products/[slug]/loading.tsx                             │
│     └─ /[slug]/loading.tsx                                      │
│                                                                 │
│  Phase 2: Layout Optimization (2-3 hours)                       │
│  └─ Add Navbar/Footer wrappers                                  │
│     ├─ components/navbar-wrapper.tsx                            │
│     ├─ components/footer-wrapper.tsx                            │
│     ├─ components/skeletons/navbar-skeleton.tsx                 │
│     ├─ components/skeletons/footer-skeleton.tsx                 │
│     └─ Update app/[locale]/layout.tsx                           │
│                                                                 │
│  Phase 3: Page Optimization (as needed)                         │
│  └─ Add section-level Suspense to complex pages                 │
│     └─ Typically homepage, dashboards, etc.                     │
│                                                                 │
│  Phase 4: Polish (ongoing)                                      │
│  └─ Create reusable skeleton component library                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Your Enhancements

### Simulate Slow Network

```bash
# In Chrome DevTools:
# 1. Open Network tab
# 2. Select "Slow 3G" from throttling dropdown
# 3. Navigate between pages
# 4. Verify loading states appear
```

### Verify Build Output

```bash
yarn build
```

Look for route indicators:
- `○` Static - fully pre-rendered
- `◐` Partial Prerender - static shell + streaming
- `ƒ` Dynamic - server-rendered on demand

### Debug Cache and Suspense

```bash
# Enable verbose logging
NEXT_PRIVATE_DEBUG_CACHE=1 yarn dev
```

---

## Checklist

Use this checklist to track your progress:

### Phase 1: Loading Files
- [ ] `app/[locale]/(marketing)/blog/loading.tsx`
- [ ] `app/[locale]/(marketing)/products/loading.tsx`
- [ ] `app/[locale]/(marketing)/products/[slug]/loading.tsx`
- [ ] `app/[locale]/(marketing)/[slug]/loading.tsx`

### Phase 2: Layout Wrappers
- [ ] `components/navbar-wrapper.tsx`
- [ ] `components/footer-wrapper.tsx`
- [ ] `components/skeletons/navbar-skeleton.tsx`
- [ ] `components/skeletons/footer-skeleton.tsx`
- [ ] Update `app/[locale]/layout.tsx`

### Phase 3: Page Sections
- [ ] Identify pages with multiple data sources
- [ ] Create async section components
- [ ] Add Suspense boundaries with skeletons

### Phase 4: Skeleton Library
- [ ] Create `components/skeletons/index.tsx`
- [ ] Refactor existing skeletons to use shared components

---

## Summary

| Enhancement | Effort | Impact | When to Add |
|-------------|--------|--------|-------------|
| Loading files | Low | High | Now - easy win |
| Navbar/Footer wrappers | Medium | Medium | If global data is slow |
| Page section Suspense | Medium | Medium | For complex pages |
| Skeleton library | Low | Low | When you have 5+ skeletons |

Remember: **You don't need all of these.** Start with loading files for your most-used dynamic routes, then add more as needed based on user feedback and performance metrics.
