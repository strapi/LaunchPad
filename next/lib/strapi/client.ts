import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { draftMode } from 'next/headers';
import qs from 'qs';

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

/**
 * Generic Strapi client fetch.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchApi<T = any>(
  url: string,
  params: Record<string, any> = {}
): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  const queryParams = { ...params };
  if (isDraftMode) {
    // Add status=draft parameter when draft mode is enabled
    queryParams.status = 'draft';
  }

  const res = await createClient().fetch(
    `${url}?${qs.stringify(queryParams)}`,
    {
      headers: {
        // Enable content source maps in preview mode
        'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
      },
    }
  );

  const data = res.json();
  return data;
}

/**
 * Generic Strapi client fetch.
 * Use only in Global Scope. draftMode() cannot be used outside a request scope.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchApiWithoutDraft<T = any>(
  url: string,
  params: Record<string, any> = {}
): Promise<T> {
  const res = await createClient().fetch(`${url}?${qs.stringify(params)}`);

  const data = res.json();
  return data;
}
