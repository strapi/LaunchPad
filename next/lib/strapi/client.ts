import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly contentType: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

const createClient = (config?: Omit<Config, 'baseURL'>) =>
  strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
    ...config,
  });

/**
 * Cached fetch for collection types (published content only).
 * Uses Next.js 16 'use cache' directive for explicit caching.
 */
async function fetchCollectionCached<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes'); // Cache for 15 minutes by default
  cacheTag(`collection-${collectionName}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .find({
      ...options,
      status: 'published',
    });

  return data as T;
}

/**
 * Fetches a collection type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchCollectionType<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    // Bypass cache in draft mode for real-time preview
    if (isDraftMode) {
      const { data } = await createClient(config)
        .collection(collectionName)
        .find({
          ...options,
          status: 'draft',
        });
      return data as T;
    }

    // Use cached version for published content
    return fetchCollectionCached<T>(collectionName, options, config);
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch collection "${collectionName}"`,
      collectionName,
      error
    );
  }
}

/**
 * Cached fetch for single types (published content only).
 */
async function fetchSingleCached<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`single-${singleTypeName}`);

  const { data } = await createClient(config)
    .single(singleTypeName)
    .find({
      ...options,
      status: 'published',
    });

  return data as T;
}

/**
 * Fetches a single type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchSingleType<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    if (isDraftMode) {
      const { data } = await createClient(config)
        .single(singleTypeName)
        .find({
          ...options,
          status: 'draft',
        });
      return data as T;
    }

    return fetchSingleCached<T>(singleTypeName, options, config);
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch single type "${singleTypeName}"`,
      singleTypeName,
      error
    );
  }
}

/**
 * Cached fetch for documents (published content only).
 */
async function fetchDocumentCached<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`document-${collectionName}-${documentId}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .findOne(documentId, {
      ...options,
      status: 'published',
    });

  return data as T;
}

/**
 * Fetches a single document from a collection by documentId.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchDocument<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    if (isDraftMode) {
      const { data } = await createClient(config)
        .collection(collectionName)
        .findOne(documentId, {
          ...options,
          status: 'draft',
        });
      return data as T;
    }

    return fetchDocumentCached<T>(collectionName, documentId, options, config);
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch document "${documentId}" from "${collectionName}"`,
      collectionName,
      error
    );
  }
}

/**
 * Revalidate cache for a specific content type.
 * Call this from a webhook when Strapi content is updated.
 *
 * @example
 * // Revalidate all articles
 * revalidateContent('collection', 'articles');
 *
 * // Revalidate a specific document
 * revalidateContent('document', 'articles', 'abc123');
 *
 * // Revalidate a single type
 * revalidateContent('single', 'global');
 */
export function revalidateContent(
  type: 'collection' | 'single' | 'document',
  contentType: string,
  documentId?: string
): void {
  // Use 'max' profile for stale-while-revalidate behavior
  // This serves stale content while fetching fresh data in background
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
