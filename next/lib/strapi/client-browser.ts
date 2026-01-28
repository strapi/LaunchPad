'use client';

import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';

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

const createClientBrowser = (config?: Omit<Config, 'baseURL'>) => {
  return strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    ...config,
  });
}


/**
 * Client-side fetch pour React Query - Collection
 */
export async function fetchCollectionTypeClient<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowser(config)
      .collection(collectionName)
      .find(options);

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
 * Client-side fetch pour React Query - Document unique
 */
export async function fetchDocumentClient<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowser(config)
      .collection(collectionName)
      .findOne(documentId, options);

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
 * Client-side fetch pour React Query - Single Type
 */
export async function fetchSingleTypeClient<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowser(config)
      .single(singleTypeName)
      .find(options);

    return data as T;
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch single type "${singleTypeName}"`,
      singleTypeName,
      error
    );
  }
}


// ************ Public Request *************

const createClientBrowserPublic = (config?: Omit<Config, 'baseURL'>) => {
  return strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL_IMAGE ?? ''}/api`,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    ...config,
  });
}


/**
 * Client-side fetch pour React Query - Collection
 */
export async function fetchCollectionTypeClientPublic<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowserPublic(config)
      .collection(collectionName)
      .find(options);

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
 * Client-side fetch pour React Query - Document unique
 */
export async function fetchDocumentClientPublic<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowserPublic(config)
      .collection(collectionName)
      .findOne(documentId, options);

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
 * Client-side fetch pour React Query - Single Type
 */
export async function fetchSingleTypeClientPublic<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  try {
    const { data } = await createClientBrowserPublic(config)
      .single(singleTypeName)
      .find(options);

    return data as T;
  } catch (error) {
    throw new StrapiError(
      `Failed to fetch single type "${singleTypeName}"`,
      singleTypeName,
      error
    );
  }
}