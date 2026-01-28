# Next.js 16 Data Loading and Caching Guide

This document explains the data loading and caching changes introduced in Next.js 16, specifically for the LaunchPad starter template with Strapi integration.

## Table of Contents

- [Overview](#overview)
- [Key Changes from Next.js 15](#key-changes-from-nextjs-15)
- [The New Caching Paradigm](#the-new-caching-paradigm)
- [Understanding `'use cache'` Directive](#understanding-use-cache-directive)
- [Cache Configuration APIs](#cache-configuration-apis)
- [Implementation in LaunchPad](#implementation-in-launchpad)
- [Revalidation Strategies](#revalidation-strategies)
- [Suspense Boundaries](#suspense-boundaries)
- [Draft Mode and Preview](#draft-mode-and-preview)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Overview

Next.js 16 introduces a fundamentally new approach to caching called **Cache Components**. Unlike previous versions where caching was implicit and controlled via fetch options, Next.js 16 makes caching **explicit and opt-in** through the `'use cache'` directive.

### Why This Matters

| Aspect | Next.js 14-15 | Next.js 16 |
|--------|---------------|------------|
| Caching | Implicit (automatic) | Explicit (opt-in) |
| Control | `fetch()` options | `'use cache'` directive |
| Granularity | Per-request | Per-function/component/page |
| Mental Model | "Everything cached by default" | "Nothing cached unless specified" |

---

## Key Changes from Next.js 15

### 1. No More Implicit Fetch Caching

**Before (Next.js 15):**
```typescript
// Caching controlled via fetch options
const data = await fetch(url, {
  next: {
    revalidate: 60,      // Cache for 60 seconds
    tags: ['articles']   // Tag for revalidation
  }
});
```

**After (Next.js 16):**
```typescript
// Caching controlled via directive and APIs
async function getData() {
  'use cache';
  cacheLife('minutes');
  cacheTag('articles');

  const data = await fetch(url);
  return data;
}
```

### 2. Middleware Renamed to Proxy

The `middleware.ts` file is now `proxy.ts`, and the exported function is renamed from `middleware` to `proxy`.

**Before:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) { ... }
```

**After:**
```typescript
// proxy.ts
export function proxy(request: NextRequest) { ... }
```

### 3. Async APIs Are Mandatory

All dynamic APIs must be awaited:

```typescript
// params, searchParams, cookies(), headers(), draftMode()
// ALL must be awaited

export default async function Page(props: {
  params: Promise<{ slug: string }>;  // Note: Promise type
}) {
  const params = await props.params;  // Must await
  // ...
}
```

### 4. Turbopack is Default

The `--turbopack` flag is no longer needed in scripts:

```json
{
  "scripts": {
    "dev": "next dev",        // Turbopack is automatic
    "build": "next build"     // Turbopack is automatic
  }
}
```

---

## The New Caching Paradigm

### Enabling Cache Components

First, enable the feature in `next.config.mjs`:

```javascript
const nextConfig = {
  cacheComponents: true,  // Required for 'use cache' directive
  // ... other config
};
```

### The Three Pillars

Next.js 16 caching is built on three core concepts:

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 CACHING                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 'use cache'     →  Enables caching for a scope              │
│                        (function, component, or file)           │
│                                                                 │
│  2. cacheLife()     →  Defines HOW LONG to cache                │
│                        (seconds, minutes, hours, days, max)     │
│                                                                 │
│  3. cacheTag()      →  Defines HOW TO INVALIDATE                │
│                        (named tags for on-demand revalidation)  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Understanding `'use cache'` Directive

The `'use cache'` directive tells Next.js to cache the return value of a function or component. It can be applied at three levels:

### 1. Function Level (Most Common)

```typescript
async function fetchArticles() {
  'use cache';  // Cache this function's return value

  const response = await fetch('/api/articles');
  return response.json();
}
```

### 2. Component Level

```typescript
async function ArticleList() {
  'use cache';  // Cache the entire component output

  const articles = await fetch('/api/articles');
  return (
    <ul>
      {articles.map(article => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
```

### 3. File Level

```typescript
'use cache';  // Cache ALL exports from this file

export async function getArticles() { ... }
export async function getProducts() { ... }
```

### How Cache Keys Work

Cache entries are generated from:

1. **Build ID** - Invalidates all cache on new deployments
2. **Function ID** - Hash of function location and signature
3. **Serializable Arguments** - Props or function parameters

```typescript
// Different arguments = different cache entries
async function getArticle(slug: string) {
  'use cache';
  // slug='hello' and slug='world' are cached separately
  return fetch(`/api/articles/${slug}`);
}
```

### Serialization Rules

**Supported types for arguments:**
- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Plain objects: `{ key: value }`
- Arrays: `[1, 2, 3]`
- Dates, Maps, Sets

**NOT supported:**
- Class instances
- Functions (except pass-through)
- Symbols, WeakMaps, WeakSets

```typescript
// ✅ Valid - serializable arguments
async function getUser(userId: string, options: { locale: string }) {
  'use cache';
  return fetch(`/api/users/${userId}?locale=${options.locale}`);
}

// ❌ Invalid - class instance
async function getUser(user: UserClass) {
  'use cache';
  return fetch(`/api/users/${user.id}`);  // Error!
}
```

---

## Cache Configuration APIs

### `cacheLife()` - Cache Duration

Controls how long data stays cached. Import from `next/cache`:

```typescript
import { cacheLife } from 'next/cache';

async function getData() {
  'use cache';
  cacheLife('hours');  // Use the 'hours' profile
  return fetch('/api/data');
}
```

### Built-in Cache Profiles

| Profile | Stale (Client) | Revalidate (Server) | Expire |
|---------|----------------|---------------------|--------|
| `'seconds'` | 0 | 1 second | 60 seconds |
| `'minutes'` | 5 minutes | 15 minutes | never |
| `'hours'` | 5 minutes | 1 hour | never |
| `'days'` | 5 minutes | 1 day | never |
| `'weeks'` | 5 minutes | 1 week | never |
| `'max'` | 5 minutes | never | never |

### Understanding the Three Times

```
┌─────────────────────────────────────────────────────────────────┐
│                     CACHE TIMELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STALE time (client-side)                                       │
│  └─ How long browser serves from memory without checking server │
│                                                                 │
│  REVALIDATE time (server-side)                                  │
│  └─ How long server serves cached response before refreshing    │
│     Uses stale-while-revalidate: serves stale, fetches fresh    │
│                                                                 │
│  EXPIRE time                                                    │
│  └─ Hard deadline when cache entry is completely deleted        │
│     After this, next request is a cache miss                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Custom Cache Profiles

Define custom profiles in `next.config.mjs`:

```javascript
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    // Custom profile for frequently updated content
    'frequent': {
      stale: 60,        // 1 minute client cache
      revalidate: 300,  // 5 minute server cache
      expire: 3600,     // 1 hour hard expire
    },
    // Custom profile for mostly static content
    'static': {
      stale: 3600,       // 1 hour client cache
      revalidate: 86400, // 1 day server cache
      expire: false,     // Never expire
    },
  },
};
```

### `cacheTag()` - Cache Invalidation

Tags cache entries for on-demand revalidation:

```typescript
import { cacheTag } from 'next/cache';

async function getArticles() {
  'use cache';
  cacheLife('hours');
  cacheTag('articles');  // Tag for invalidation

  return fetch('/api/articles');
}

async function getArticle(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('articles', `article-${slug}`);  // Multiple tags

  return fetch(`/api/articles/${slug}`);
}
```

---

## Implementation in LaunchPad

### Strapi Client Architecture

The LaunchPad template implements a dual-path caching strategy:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  fetchCollectionType('articles')                                │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │  Check draftMode │                                           │
│  └────────┬────────┘                                            │
│           │                                                     │
│     ┌─────┴─────┐                                               │
│     │           │                                               │
│     ▼           ▼                                               │
│  Draft ON    Draft OFF                                          │
│     │           │                                               │
│     ▼           ▼                                               │
│  Direct      Cached                                             │
│  Fetch       Fetch                                              │
│  (fresh)     ('use cache')                                      │
│     │           │                                               │
│     └─────┬─────┘                                               │
│           │                                                     │
│           ▼                                                     │
│       Response                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Strapi Client Code

```typescript
// lib/strapi/client.ts

import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

/**
 * Cached fetch - uses 'use cache' directive
 * Only called for published (non-draft) content
 */
async function fetchCollectionCached<T>(
  collectionName: string,
  options?: QueryParams
): Promise<T> {
  'use cache';
  cacheLife('minutes');                      // 15 min cache
  cacheTag(`collection-${collectionName}`);  // Tag for revalidation

  const { data } = await strapiClient
    .collection(collectionName)
    .find({ ...options, status: 'published' });

  return data as T;
}

/**
 * Public API - checks draft mode and routes accordingly
 */
export async function fetchCollectionType<T>(
  collectionName: string,
  options?: QueryParams
): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  // Draft mode: bypass cache for real-time preview
  if (isDraftMode) {
    const { data } = await strapiClient
      .collection(collectionName)
      .find({ ...options, status: 'draft' });
    return data as T;
  }

  // Published: use cached version
  return fetchCollectionCached<T>(collectionName, options);
}
```

### Why Two Functions?

The `'use cache'` directive has a critical limitation: **you cannot call runtime APIs inside a cached function**.

```typescript
// ❌ This will NOT work
async function fetchData() {
  'use cache';
  const { isEnabled } = await draftMode();  // Error! Runtime API
  // ...
}

// ✅ This works - runtime check is OUTSIDE the cached function
async function fetchData() {
  const { isEnabled } = await draftMode();  // OK - outside cache

  if (isEnabled) {
    return fetchUncached();  // Direct fetch
  }
  return fetchCached();      // Cached fetch with 'use cache'
}
```

---

## Revalidation Strategies

### On-Demand Revalidation

Use `revalidateTag()` to invalidate cache when content changes:

```typescript
import { revalidateTag } from 'next/cache';

// In Next.js 16, revalidateTag requires a cache profile
revalidateTag('articles', 'max');  // 'max' = stale-while-revalidate
```

### The `revalidateContent` Helper

LaunchPad provides a helper function:

```typescript
// lib/strapi/client.ts
export function revalidateContent(
  type: 'collection' | 'single' | 'document',
  contentType: string,
  documentId?: string
): void {
  switch (type) {
    case 'collection':
      revalidateTag(`collection-${contentType}`, 'max');
      break;
    case 'single':
      revalidateTag(`single-${contentType}`, 'max');
      break;
    case 'document':
      if (documentId) {
        revalidateTag(`document-${contentType}-${documentId}`, 'max');
      }
      break;
  }
}
```

### Webhook Integration

Create an API route to handle Strapi webhooks:

```typescript
// app/api/revalidate/route.ts
import { revalidateContent } from '@/lib/strapi';

export async function POST(request: Request) {
  // Verify webhook secret
  const secret = request.headers.get('x-webhook-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse Strapi webhook payload
  const payload = await request.json();
  const { model, entry } = payload;

  // Revalidate the appropriate cache
  if (entry?.documentId) {
    // Specific document changed
    revalidateContent('document', model, entry.documentId);
  }
  // Always revalidate the collection
  revalidateContent('collection', model);

  return Response.json({
    revalidated: true,
    model,
    documentId: entry?.documentId
  });
}
```

### Strapi Webhook Configuration

In Strapi admin, configure a webhook:

1. Go to **Settings > Webhooks**
2. Create new webhook:
   - **Name**: Next.js Revalidation
   - **URL**: `https://your-site.com/api/revalidate`
   - **Headers**: `x-webhook-secret: your-secret`
   - **Events**: Entry create, update, delete, publish, unpublish

---

## Suspense Boundaries

### Why Suspense is Required

With `cacheComponents: true`, Next.js requires proper Suspense boundaries for streaming and partial prerendering. Without them, you'll see this error:

```
Error: Uncached data was accessed outside of <Suspense>
```

### Root Layout Pattern

The root layout should wrap children in Suspense:

```typescript
// app/layout.tsx
import { Suspense } from 'react';

function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<RootLoading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
```

### Route-Level Loading

Create `loading.tsx` files for route-specific loading states:

```typescript
// app/[locale]/blog/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-700 rounded w-5/6" />
    </div>
  );
}
```

### Component-Level Suspense

For granular loading states within a page:

```typescript
// app/[locale]/page.tsx
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main>
      <Hero />  {/* Static, no suspense needed */}

      <Suspense fallback={<ArticlesSkeleton />}>
        <LatestArticles />  {/* Dynamic, needs suspense */}
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />  {/* Dynamic, needs suspense */}
      </Suspense>
    </main>
  );
}
```

---

## Draft Mode and Preview

### How Draft Mode Works with Caching

Draft mode allows content editors to preview unpublished content. It must bypass the cache:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRAFT MODE FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Editor clicks "Preview" in Strapi                              │
│           │                                                     │
│           ▼                                                     │
│  Redirects to /api/preview?secret=xxx&url=/blog/my-draft        │
│           │                                                     │
│           ▼                                                     │
│  API route enables draft mode cookie                            │
│           │                                                     │
│           ▼                                                     │
│  Redirects to /blog/my-draft                                    │
│           │                                                     │
│           ▼                                                     │
│  Page component checks draftMode()                              │
│           │                                                     │
│           ▼                                                     │
│  isDraftMode = true → Bypasses cache, fetches draft content     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Preview API Routes

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url') ?? '/';

  // Verify secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the preview URL
  redirect(url);
}

// app/api/exit-preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') ?? '/';
  redirect(url);
}
```

---

## Common Patterns

### Pattern 1: Cached Page with Dynamic Params

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { fetchCollectionType } from '@/lib/strapi';

export default async function BlogPost(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await props.params;

  // This uses the cached fetch internally
  const [article] = await fetchCollectionType('articles', {
    filters: { slug: { $eq: slug } },
    locale,
  });

  if (!article) {
    return notFound();
  }

  return <ArticleContent article={article} />;
}
```

### Pattern 2: Static Data with Long Cache

```typescript
async function getNavigation() {
  'use cache';
  cacheLife('days');  // Navigation rarely changes
  cacheTag('navigation');

  return fetchSingleType('global');
}
```

### Pattern 3: User-Specific Data (No Cache)

```typescript
// Don't cache user-specific data
async function getUserProfile(userId: string) {
  // No 'use cache' - always fresh
  const response = await fetch(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
}
```

### Pattern 4: Partial Caching in Components

```typescript
async function ProductPage({ productId }: { productId: string }) {
  // Cached product data
  const product = await getProduct(productId);  // Has 'use cache'

  // Fresh inventory (not cached)
  const inventory = await getInventory(productId);  // No cache

  return (
    <div>
      <ProductDetails product={product} />
      <InventoryStatus count={inventory.count} />
    </div>
  );
}
```

---

## Troubleshooting

### Error: "use cache" requires cacheComponents

**Problem:**
```
To use "use cache", please enable the feature flag `cacheComponents`
```

**Solution:**
Add to `next.config.mjs`:
```javascript
const nextConfig = {
  cacheComponents: true,
};
```

### Error: Uncached data accessed outside Suspense

**Problem:**
```
Error: Uncached data was accessed outside of <Suspense>
```

**Solution:**
Wrap dynamic content in Suspense boundaries:
```typescript
<Suspense fallback={<Loading />}>
  <DynamicComponent />
</Suspense>
```

### Error: Cannot serialize argument

**Problem:**
```
Error: Cannot serialize class instance as argument
```

**Solution:**
Extract serializable data before passing to cached functions:
```typescript
// ❌ Wrong
const user = new User(data);
await getCachedData(user);

// ✅ Correct
const userId = user.id;
await getCachedData(userId);
```

### Error: Runtime API in cached function

**Problem:**
```
Error: cookies()/headers()/draftMode() called inside 'use cache'
```

**Solution:**
Move runtime API calls outside the cached function:
```typescript
// ❌ Wrong
async function getData() {
  'use cache';
  const cookies = await cookies();  // Error!
}

// ✅ Correct
async function getData(locale: string) {
  'use cache';
  // Use passed argument instead
}

// Call site
const cookies = await cookies();
const locale = cookies.get('locale')?.value;
await getData(locale);
```

### Cache Not Updating

**Problem:** Content updated in Strapi but not showing on site.

**Solutions:**

1. **Check webhook is configured** in Strapi
2. **Verify revalidation endpoint** is being called
3. **Check cache tags match** between fetch and revalidate
4. **Try manual revalidation:**
   ```bash
   curl -X POST https://your-site.com/api/revalidate \
     -H "x-webhook-secret: your-secret" \
     -H "Content-Type: application/json" \
     -d '{"model": "articles"}'
   ```

### Debug Cache Behavior

Enable verbose cache logging:
```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

---

## Quick Reference

### Imports

```typescript
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode, cookies, headers } from 'next/headers';
```

### Cache Profiles

| Profile | Use Case |
|---------|----------|
| `'seconds'` | Real-time data (stock prices, live scores) |
| `'minutes'` | Frequently updated (news, social feeds) |
| `'hours'` | Regular content (blog posts, products) |
| `'days'` | Stable content (documentation, about pages) |
| `'max'` | Static content (rarely changes) |

### Tag Naming Convention

```typescript
// Collections
cacheTag(`collection-${collectionName}`);  // 'collection-articles'

// Single types
cacheTag(`single-${singleTypeName}`);      // 'single-global'

// Individual documents
cacheTag(`document-${collection}-${id}`);  // 'document-articles-abc123'
```

---

## Further Reading

- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16)
- [Next.js Caching Documentation](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [use cache Directive Reference](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Strapi Documentation](https://docs.strapi.io/)
