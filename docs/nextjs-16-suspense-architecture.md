# Next.js 16 Suspense Architecture Guide

When enabling `cacheComponents: true` in Next.js 16, the framework enforces strict Suspense boundary requirements throughout your entire component tree. This guide explains the architectural changes needed to properly support this feature.

## Table of Contents

- [Why Suspense Boundaries Are Required](#why-suspense-boundaries-are-required)
- [The Problem](#the-problem)
- [Architecture Overview](#architecture-overview)
- [Required Changes](#required-changes)
- [Implementation Guide](#implementation-guide)
- [Component Patterns](#component-patterns)
- [Migration Checklist](#migration-checklist)

---

## Why Suspense Boundaries Are Required

### The Core Concept

With `cacheComponents: true`, Next.js 16 uses **Partial Prerendering (PPR)** - a hybrid rendering strategy that:

1. **Prerenders static parts** of your page at build time
2. **Streams dynamic parts** when requested
3. **Uses Suspense boundaries** to identify where static ends and dynamic begins

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARTIAL PRERENDERING                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    STATIC SHELL                          │   │
│  │  (Prerendered at build time - instant delivery)          │   │
│  │                                                          │   │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐    │   │
│  │  │    Navigation   │  │         Header              │    │   │
│  │  │    (static)     │  │         (static)            │    │   │
│  │  └─────────────────┘  └─────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ <Suspense fallback={<Skeleton />}>                 │  │   │
│  │  │   ┌──────────────────────────────────────────────┐ │  │   │
│  │  │   │          DYNAMIC CONTENT                     │ │  │   │
│  │  │   │   (Streamed after initial load)              │ │  │   │
│  │  │   │                                              │ │  │   │
│  │  │   │   - Fetches data with 'use cache'            │ │  │   │
│  │  │   │   - Rendered on server                       │ │  │   │
│  │  │   │   - Streamed to client                       │ │  │   │
│  │  │   └──────────────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                    Footer (static)                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Happens Without Suspense

Without proper Suspense boundaries, Next.js cannot:
- Identify where to split static and dynamic content
- Stream dynamic content progressively
- Show loading states while data fetches

This results in the error:
```
Error: Route "/[locale]/blog/[slug]": Uncached data was accessed
outside of <Suspense>. This delays the entire page from rendering,
resulting in a slow user experience.
```

---

## The Problem

### Current Architecture Issues

The LaunchPad template has several patterns that conflict with strict Suspense requirements:

#### 1. Client Context Providers Wrapping Server Components

```typescript
// app/layout.tsx - PROBLEMATIC
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SlugProvider>      {/* Client component */}
          {children}        {/* Contains server components that fetch data */}
        </SlugProvider>
      </body>
    </html>
  );
}
```

**Problem:** The `SlugProvider` is a client component that wraps `children`. Those children include server components that perform async data fetching. Next.js cannot determine Suspense boundaries across this client/server boundary.

#### 2. Layouts That Fetch Data

```typescript
// app/[locale]/layout.tsx - PROBLEMATIC
export default async function LocaleLayout({ children, params }) {
  const params = await props.params;
  const pageData = await fetchSingleType('global');  // Data fetch in layout

  return (
    <div>
      <Navbar data={pageData.navbar} />
      {children}  {/* No Suspense boundary */}
      <Footer data={pageData.footer} />
    </div>
  );
}
```

**Problem:** The layout fetches data but doesn't wrap `children` in Suspense. Any dynamic pages rendered as children will cause the error.

#### 3. Pages Without Loading States

```typescript
// app/[locale]/blog/[slug]/page.tsx - PROBLEMATIC
export default async function BlogPost({ params }) {
  const article = await fetchCollectionType('articles');  // Dynamic fetch
  return <Article data={article} />;  // No fallback UI
}
```

**Problem:** Dynamic routes with data fetching need either:
- A `loading.tsx` file in the same directory
- To be wrapped in `<Suspense>` by a parent component

---

## Architecture Overview

### The Solution: Layered Suspense Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT TREE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RootLayout (app/layout.tsx)                                    │
│  └─ <Suspense fallback={<RootLoading />}>  ← BOUNDARY 1         │
│     └─ LocaleLayout (app/[locale]/layout.tsx)                   │
│        ├─ <Suspense fallback={<NavSkeleton />}>  ← BOUNDARY 2   │
│        │  └─ <NavbarWrapper /> (fetches data)                   │
│        │                                                        │
│        ├─ {children} ← NO Suspense needed here!                 │
│        │  └─ loading.tsx handles each route automatically       │
│        │                                                        │
│        └─ <Suspense fallback={<FooterSkeleton />}> ← BOUNDARY 3 │
│           └─ <FooterWrapper /> (fetches data)                   │
│                                                                 │
│  Page (app/[locale]/blog/[slug]/page.tsx)                       │
│  └─ loading.tsx provides fallback  ← BOUNDARY 4 (automatic)    │
│     └─ <BlogPost /> (fetches article data)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Every async operation needs a Suspense boundary above it**
2. **Client components that wrap server components need Suspense inside them**
3. **Dynamic routes should use `loading.tsx`** - this automatically creates Suspense boundaries
4. **Async components in layouts need explicit `<Suspense>`** - only for non-page components like Navbar/Footer wrappers
5. **Don't duplicate boundaries** - if a route has `loading.tsx`, you don't need Suspense around `{children}` in the layout

---

## Required Changes

### Change 1: Root Layout with Suspense

**File:** `app/layout.tsx`

```typescript
import { Suspense } from 'react';
import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';

// Loading component for the entire app shell
function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Preview />
        <SlugProvider>
          {/* Suspense boundary wraps all children */}
          <Suspense fallback={<RootLoading />}>
            {children}
          </Suspense>
        </SlugProvider>
      </body>
    </html>
  );
}
```

**Why:** The `SlugProvider` is a client component. By adding Suspense inside it, we create a boundary that allows server components in `children` to stream their content.

---

### Change 2: Locale Layout with Isolated Data Fetching

**File:** `app/[locale]/layout.tsx`

```typescript
import { Suspense } from 'react';
import { draftMode } from 'next/headers';

import { DraftModeBanner } from '@/components/draft-mode-banner';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { FooterWrapper } from '@/components/footer-wrapper';
import { CartProvider } from '@/context/cart-context';

// Skeleton components for loading states
function NavbarSkeleton() {
  return (
    <nav className="h-16 bg-charcoal border-b border-gray-800 animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="h-8 w-32 bg-gray-700 rounded" />
        <div className="ml-auto flex gap-4">
          <div className="h-4 w-16 bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-700 rounded" />
        </div>
      </div>
    </nav>
  );
}

function FooterSkeleton() {
  return (
    <footer className="h-48 bg-charcoal border-t border-gray-800 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-700 rounded" />
              <div className="h-3 w-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </footer>
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
      <div className="bg-charcoal antialiased h-full w-full">
        {/* Navbar with its own Suspense boundary */}
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarWrapper locale={locale} />
        </Suspense>

        {/* Page content - loading.tsx files handle Suspense for each route */}
        {children}

        {/* Footer with its own Suspense boundary */}
        <Suspense fallback={<FooterSkeleton />}>
          <FooterWrapper locale={locale} />
        </Suspense>

        {isDraftMode && <DraftModeBanner />}
      </div>
    </CartProvider>
  );
}
```

**Why:** Async components like Navbar and Footer need explicit Suspense boundaries because they fetch data but aren't pages. The `{children}` (page content) does NOT need Suspense here because each route's `loading.tsx` file automatically creates a Suspense boundary for that page.

> **Note:** `loading.tsx` files automatically wrap page content in `<Suspense>`. You only need explicit `<Suspense>` in layouts for async components that aren't pages (like Navbar/Footer wrappers).

---

### Change 3: Create Async Wrapper Components

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

**Why:** These wrapper components isolate the async data fetching. The parent layout can wrap them in Suspense without needing to know about their data requirements.

---

### Change 4: Add Loading Files for Dynamic Routes

Create `loading.tsx` files for each dynamic route:

**File:** `app/[locale]/(marketing)/blog/[slug]/loading.tsx`

```typescript
export default function Loading() {
  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Title skeleton */}
      <div className="h-12 bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />

      {/* Meta info skeleton */}
      <div className="flex gap-4 mb-8">
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
      </div>

      {/* Featured image skeleton */}
      <div className="aspect-video bg-gray-700 rounded-lg mb-8 animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    </article>
  );
}
```

**File:** `app/[locale]/(marketing)/products/[slug]/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-gray-700 rounded w-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/blog/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-10 bg-gray-700 rounded w-48 mb-8 animate-pulse" />

      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/products/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-10 bg-gray-700 rounded w-48 mb-8 animate-pulse" />

      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File:** `app/[locale]/(marketing)/[slug]/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-12 bg-gray-700 rounded w-1/2 mb-8 animate-pulse" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Why:** `loading.tsx` files automatically create Suspense boundaries for their route segment. Next.js uses these as fallbacks while the page component loads.

---

### Change 5: Update Page Components (Optional Enhancement)

For more granular loading states within pages:

**File:** `app/[locale]/(marketing)/page.tsx`

```typescript
import { Suspense } from 'react';
import { HeroSection } from '@/components/hero-section';
import { FeaturedArticles } from '@/components/featured-articles';
import { FeaturedProducts } from '@/components/featured-products';

// Skeleton components
function ArticlesSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-lg" />
              <div className="h-6 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square bg-gray-700 rounded-lg" />
              <div className="h-5 bg-gray-700 rounded w-3/4" />
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
    <main>
      {/* Hero can be static or have its own boundary */}
      <HeroSection locale={locale} />

      {/* Each dynamic section gets its own Suspense boundary */}
      <Suspense fallback={<ArticlesSkeleton />}>
        <FeaturedArticles locale={locale} />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts locale={locale} />
      </Suspense>
    </main>
  );
}
```

**Why:** This pattern allows different sections of the page to load independently. Users see content as soon as it's ready, rather than waiting for everything.

---

## Component Patterns

### Pattern 1: Async Server Component with Wrapper

```typescript
// components/article-list.tsx
import { fetchCollectionType } from '@/lib/strapi';

interface ArticleListProps {
  locale: string;
  limit?: number;
}

export async function ArticleList({ locale, limit = 10 }: ArticleListProps) {
  const articles = await fetchCollectionType('articles', {
    locale,
    pagination: { limit },
  });

  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}
```

**Usage with Suspense:**
```typescript
<Suspense fallback={<ArticleListSkeleton />}>
  <ArticleList locale={locale} limit={5} />
</Suspense>
```

### Pattern 2: Composition with Multiple Boundaries

```typescript
// Good: Each async component has its own boundary
export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Suspense fallback={<StatsSkeleton />}>
        <StatsWidget />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

### Pattern 3: Nested Suspense for Progressive Loading

```typescript
export default function ProductPage({ productId }) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductDetails productId={productId} />

      {/* Nested Suspense - loads after product details */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={productId} />
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts productId={productId} />
      </Suspense>
    </Suspense>
  );
}
```

### Pattern 4: Error Boundaries with Suspense

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-900/20 rounded-lg">
      <p className="text-red-400">Failed to load content</p>
      <button onClick={resetErrorBoundary} className="text-sm underline">
        Try again
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <AsyncContent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Migration Checklist

Use this checklist when migrating to `cacheComponents: true`:

### Configuration

- [ ] Enable `cacheComponents: true` in `next.config.mjs`
- [ ] Verify Node.js version is 20.9+
- [ ] Update all Next.js related packages to v16

### Root Layout (`app/layout.tsx`)

- [ ] Import `Suspense` from React
- [ ] Wrap `{children}` in `<Suspense>` inside any client context providers
- [ ] Create a `RootLoading` component for the fallback

### Locale/Nested Layouts

- [ ] Identify all data fetching in layouts
- [ ] Create wrapper components for data-fetching UI (Navbar, Footer, etc.)
- [ ] Wrap each wrapper component in `<Suspense>`
- [ ] Create skeleton components for each fallback
- [ ] **Do NOT** wrap `{children}` in Suspense - `loading.tsx` files handle this automatically

### Dynamic Routes

For each route with `[param]`:

- [ ] Create `loading.tsx` in the route directory
- [ ] Design appropriate skeleton UI matching the page layout
- [ ] Test that loading state appears during navigation

### Pages with Multiple Data Sources

- [ ] Identify independent data fetching sections
- [ ] Create async components for each section
- [ ] Wrap each in `<Suspense>` with appropriate skeleton
- [ ] Consider loading priority (what should users see first?)

### Testing

- [ ] Run `yarn build` and verify no Suspense errors
- [ ] Test navigation between routes (loading states should appear)
- [ ] Test slow network (throttle in DevTools)
- [ ] Verify draft mode still works (should bypass cache)
- [ ] Test revalidation via webhook

---

## File Structure After Migration

```
app/
├── layout.tsx                    # Root layout with Suspense
├── [locale]/
│   ├── layout.tsx                # Locale layout with wrapped components
│   ├── loading.tsx               # Locale-level loading (optional)
│   ├── page.tsx                  # Home page
│   └── (marketing)/
│       ├── blog/
│       │   ├── page.tsx          # Blog list page
│       │   ├── loading.tsx       # Blog list skeleton
│       │   └── [slug]/
│       │       ├── page.tsx      # Blog post page
│       │       └── loading.tsx   # Blog post skeleton
│       ├── products/
│       │   ├── page.tsx          # Products list page
│       │   ├── loading.tsx       # Products list skeleton
│       │   └── [slug]/
│       │       ├── page.tsx      # Product detail page
│       │       └── loading.tsx   # Product detail skeleton
│       └── [slug]/
│           ├── page.tsx          # Dynamic pages
│           └── loading.tsx       # Dynamic page skeleton
│
components/
├── navbar.tsx                    # UI component (no data fetching)
├── navbar-wrapper.tsx            # Async wrapper (fetches data)
├── footer.tsx                    # UI component (no data fetching)
├── footer-wrapper.tsx            # Async wrapper (fetches data)
└── skeletons/                    # Reusable skeleton components
    ├── article-skeleton.tsx
    ├── product-skeleton.tsx
    └── ...
```

---

## Benefits After Migration

### Performance Improvements

| Metric | Before | After |
|--------|--------|-------|
| Time to First Byte | Blocked by slowest fetch | Immediate (static shell) |
| First Contentful Paint | After all data loads | Immediate (skeletons) |
| Largest Contentful Paint | After all data loads | Progressive (streaming) |
| Cumulative Layout Shift | High (content pops in) | Low (skeletons match layout) |

### User Experience

- **Instant feedback** - Users see loading states immediately
- **Progressive disclosure** - Content appears as it loads
- **Perceived performance** - App feels faster even with same data fetch times
- **Resilience** - Slow sections don't block fast ones

### Developer Experience

- **Clear boundaries** - Easy to understand what's async
- **Isolated failures** - One component's error doesn't break the page
- **Testable** - Each async component can be tested in isolation
- **Cacheable** - Fine-grained control over what gets cached

---

## Common Mistakes to Avoid

### 1. Suspense Inside Async Components

```typescript
// ❌ Wrong - Suspense inside async component
async function MyComponent() {
  const data = await fetchData();
  return (
    <Suspense fallback={<Loading />}>  {/* Too late! */}
      <Child data={data} />
    </Suspense>
  );
}

// ✅ Correct - Suspense wraps async component
function Parent() {
  return (
    <Suspense fallback={<Loading />}>
      <MyComponent />
    </Suspense>
  );
}
```

### 2. Missing Fallback

```typescript
// ❌ Wrong - No fallback
<Suspense>
  <AsyncComponent />
</Suspense>

// ✅ Correct - Always provide fallback
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

### 3. Client Component Wrapping Without Internal Suspense

```typescript
// ❌ Wrong - Client component wraps server children without Suspense
'use client';
function ClientWrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}

// ✅ Correct - Add Suspense inside client component
'use client';
import { Suspense } from 'react';
function ClientWrapper({ children }) {
  return (
    <div className="wrapper">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
```

### 4. Data Fetching in Layout Without Isolation

```typescript
// ❌ Wrong - Fetch directly in layout
async function Layout({ children }) {
  const data = await fetchData();  // Blocks everything
  return <div>{children}</div>;
}

// ✅ Correct - Isolate fetch in wrapped component
async function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />  {/* Fetches its own data */}
      </Suspense>
      {children}  {/* loading.tsx files handle Suspense for pages */}
    </div>
  );
}
```

### 5. Redundant Suspense Around Children

```typescript
// ❌ Unnecessary - duplicates what loading.tsx already does
async function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={<PageLoading />}>
        {children}  {/* Each route already has loading.tsx! */}
      </Suspense>
    </div>
  );
}

// ✅ Correct - let loading.tsx handle page boundaries
async function Layout({ children }) {
  return (
    <div>
      {children}  {/* loading.tsx creates Suspense automatically */}
    </div>
  );
}
```

---

## Further Reading

- [Next.js Suspense Documentation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
- [Partial Prerendering in Next.js](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
