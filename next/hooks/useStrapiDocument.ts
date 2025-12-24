'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { API } from '@strapi/client';
import { fetchDocumentClient, StrapiError } from '@/lib/strapi/client-browser';

export const useStrapiDocument = <T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  queryOptions?: Omit<UseQueryOptions<T, StrapiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T, StrapiError>({
    queryKey: [collectionName, documentId, JSON.stringify(options || {})],
    queryFn: () => fetchDocumentClient<T>(collectionName, documentId, options),
    ...queryOptions,
  });
};