import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
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

/**
 * Get the appropriate Strapi URL based on the environment
 * Server-side: use API_URL (http://strapi:1337 in Docker)
 * Client-side: use NEXT_PUBLIC_API_URL (http://localhost:1337)
 */
export function getStrapiURL(): string {
  // Server-side (SSR, SSG, API routes)
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
  }
  
  // Client-side (browser)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
}

const createClient = (config?: Omit<Config, 'baseURL'>) =>
  strapi({
    baseURL: `${getStrapiURL()}/api`,
    ...config,
  });

/**
 * Fetches a collection type from Strapi.
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
    const { data } = await createClient(config)
      .collection(collectionName)
      .find({
        ...options,
        status: isDraftMode ? 'draft' : 'published',
      });

    return data as T;
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch collection "${collectionName}"`,
      collectionName,
      error
    );
  }
}

/**
 * Fetches a single type from Strapi.
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
    const { data } = await createClient(config)
      .single(singleTypeName)
      .find({
        ...options,
        status: isDraftMode ? 'draft' : 'published',
      });

    return data as T;
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch single type "${singleTypeName}"`,
      singleTypeName,
      error
    );
  }
}

/**
 * Fetches a single document from a collection by documentId.
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
    const { data } = await createClient(config)
      .collection(collectionName)
      .findOne(documentId, {
        ...options,
        status: isDraftMode ? 'draft' : 'published',
      });

    return data as T;
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch document "${documentId}" from "${collectionName}"`,
      collectionName,
      error
    );
  }
}