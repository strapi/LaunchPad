'use client';

import { useEffect } from 'react';
import type { DataSourceProps } from '@/types/data-source';
import { useStrapiQuery } from '@/hooks/useStrapiQuery';

export function DataSource({
  collection,
  filters,
  sort,
  populate,
  pagination,
  fields,
  locale,
  publicationState,
  documentId,
  children,
  onDataLoaded,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  cacheTime = 10 * 60 * 1000,
}: DataSourceProps) {
  const { data, isLoading, error, refetch } = useStrapiQuery(
    {
      collection,
      filters,
      sort,
      populate,
      pagination,
      fields,
      locale,
      publicationState,
      documentId,
    },
    {
      enabled,
      staleTime,
      gcTime: cacheTime,
    }
  );

  useEffect(() => {
    if (data && onDataLoaded) {
      const dataArray = Array.isArray(data) ? data : [data];
      onDataLoaded(dataArray);
    }
  }, [data, onDataLoaded]);

  const dataArray = data ? (Array.isArray(data) ? data : [data]) : [];

  return <>{children(dataArray, isLoading, error, refetch)}</>;
}