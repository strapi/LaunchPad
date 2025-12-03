# Strapi Client SDK Refactor

This document explains the refactoring of the Strapi data fetching utilities to use the official `@strapi/client` SDK with improved error handling.

## Overview

This refactor replaced the manual `fetch()` implementation with the official `@strapi/client` SDK:

- **Before**: Manual `fetch()` calls with URL construction and query string serialization
- **After**: Official `@strapi/client` SDK with proper error handling

## File Structure

```
lib/strapi/
├── client.ts   # Core implementation using @strapi/client SDK
└── index.ts    # Re-exports from client.ts
```

---

## `client.ts`

This is the core implementation file containing all Strapi data fetching logic using the `@strapi/client` SDK.

### Custom Error Class

```typescript
class StrapiError extends Error {
  constructor(
    message: string,
    public readonly contentType: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}
```

**Why a custom error class?**

- **Context preservation**: Includes the content type name that failed, making debugging easier
- **Error chaining**: Preserves the original error via `cause` for full stack traces
- **Type discrimination**: Allows callers to use `instanceof StrapiError` for specific handling

### Client Factory

```typescript
const createClient = (config?: Omit<Config, 'baseURL'>) =>
  strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
    ...config,
  });
```

**Why a factory function?**

- **DRY principle**: Avoids repeating base URL configuration in every function
- **Extensibility**: Accepts additional config options while enforcing the base URL
- **Type safety**: `Omit<Config, 'baseURL'>` prevents accidental baseURL override

### Fetch Functions

#### `fetchCollectionType<T>()`

```typescript
export async function fetchCollectionType<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T>
```

Fetches multiple documents from a Strapi collection (e.g., blog posts, products).

**How it works:**

1. Checks Next.js draft mode to determine content status (`draft` vs `published`)
2. Creates a Strapi client and calls `.collection(name).find(options)`
3. Returns the data array, typed as `T`
4. Throws `StrapiError` on failure

#### `fetchSingleType<T>()`

```typescript
export async function fetchSingleType<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T>
```

Fetches a Strapi single type (e.g., homepage, global settings).

**How it works:**

1. Checks Next.js draft mode
2. Creates a Strapi client and calls `.single(name).find(options)`
3. Returns the single document, typed as `T`
4. Throws `StrapiError` on failure

#### `fetchDocument<T>()`

```typescript
export async function fetchDocument<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T>
```

Fetches a single document from a collection by its document ID.

**How it works:**

1. Checks Next.js draft mode
2. Creates a Strapi client and calls `.collection(name).findOne(documentId, options)`
3. Returns the document, typed as `T`
4. Throws `StrapiError` on failure

---

## `index.ts`

This file provides a clean public API by re-exporting from `client.ts`:

```typescript
export {
  fetchCollectionType,
  fetchSingleType,
  fetchDocument,
  StrapiError,
} from './client';
```

**Why a separate index file?**

- **Clean imports**: Users import from `@/lib/strapi` instead of `@/lib/strapi/client`
- **Encapsulation**: Internal implementation details stay in `client.ts`
- **Future flexibility**: Easy to add additional exports or compose functions

---

## Why These Changes?

### 1. SDK Over Manual Fetch

**Before:**
```typescript
const url = new URL(`api/${contentType}`, process.env.NEXT_PUBLIC_API_URL);
const response = await fetch(`${url.href}?${qs.stringify(queryParams)}`, {
  method: 'GET',
  cache: 'no-store',
  headers: { 'strapi-encode-source-maps': isDraftMode ? 'true' : 'false' },
});
```

**After:**
```typescript
const { data } = await createClient(config)
  .collection(collectionName)
  .find(options);
```

**Benefits:**

- Less boilerplate code
- SDK handles URL construction, query serialization, and response parsing
- Removes `qs` dependency

### 2. Throwing Errors vs Silent Failures

**Before:**
```typescript
} catch (error) {
  console.error('Error...', error);
  return [] as T;  // Silent failure - caller doesn't know something went wrong
}
```

**After:**
```typescript
} catch (error) {
  throw new StrapiError(
    `Failed to fetch collection "${collectionName}"`,
    collectionName,
    error
  );
}
```

**Benefits:**

- Errors propagate to Next.js error boundaries (`error.tsx`)
- Callers can explicitly handle errors with try/catch
- No silent data corruption (empty arrays masquerading as valid data)
- Better debugging with content type context

### 3. Consolidated Architecture

**Before:** Two files with duplicated logic:
- `fetchContentType.ts` - Manual fetch approach
- `index.ts` - SDK approach (duplicated)

**After:** Single source of truth:
- `client.ts` - All SDK logic in one place
- `index.ts` - Simple re-exports

---

## Usage Examples

### Basic Collection Fetch

```typescript
import { fetchCollectionType } from '@/lib/strapi';

// In a Server Component - errors bubble to error.tsx
const posts = await fetchCollectionType<Post[]>('posts', {
  populate: ['author', 'category'],
  sort: ['publishedAt:desc'],
});
```

### With Error Handling

```typescript
import { fetchCollectionType, StrapiError } from '@/lib/strapi';

try {
  const posts = await fetchCollectionType<Post[]>('posts');
} catch (error) {
  if (error instanceof StrapiError) {
    console.error(`Failed to fetch ${error.contentType}:`, error.cause);
    // Handle gracefully
  }
  throw error;
}
```

### Single Type Fetch

```typescript
import { fetchSingleType } from '@/lib/strapi';

const globalSettings = await fetchSingleType('global', {
  locale: 'en',
});
```

### Single Document by ID

```typescript
import { fetchDocument } from '@/lib/strapi';

const post = await fetchDocument<Post>('posts', 'abc123', {
  populate: ['author', 'comments'],
});
```

---

## Error Handling Strategy

All functions throw `StrapiError` on failure. In Next.js App Router, this integrates naturally with error boundaries:

1. **Create an `error.tsx`** in your route segment to catch errors
2. **Or use try/catch** for explicit handling in specific components

```typescript
// app/blog/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Failed to load blog posts</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

This approach ensures errors are never silently swallowed, making debugging easier and providing a better user experience through proper error boundaries.
