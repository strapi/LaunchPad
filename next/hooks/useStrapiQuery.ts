'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { DataSourceConfig } from '@/types/data-source';
import type { API } from '@strapi/client';
import { buildStrapiOptions, buildQueryKey } from '@/lib/strapi/query-builder';
import { 
  fetchCollectionTypeClientPublic, 
  fetchDocumentClientPublic,
  StrapiError 
} from '@/lib/strapi/client-browser';

export const useStrapiQuery = <T = API.Document[]>(
  config: DataSourceConfig,
  options?: Omit<UseQueryOptions<T, StrapiError>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = buildQueryKey(config);
  const strapiOptions = buildStrapiOptions(config);

  return useQuery<T, StrapiError>({
    queryKey,
    queryFn: async () => {
      if (config.documentId) {
        return fetchDocumentClientPublic<T>(
          config.collection,
          config.documentId,
          strapiOptions
        );
      } else {
        return fetchCollectionTypeClientPublic<T>(
          config.collection,
          strapiOptions
        );
      }
    },
    ...options,
  });
};