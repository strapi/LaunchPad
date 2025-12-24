// types/data-source.ts
import type { API } from '@strapi/client';

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'notContains' | 'in' | 'notIn' | 'null' | 'notNull' | 'startsWith' | 'endsWith';
  value?: any;
}

export interface DataSourceConfig {
  collection: string;
  filters?: Record<string, any>; // Format Strapi natif
  sort?: string | string[];
  populate?: API.BaseQueryParams['populate'];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  locale?: string;
  documentId?: string; // Pour fetch un document unique
  publicationState?: "draft" | "published" | undefined;
}

export interface DataSourceProps extends DataSourceConfig {
  children: (data: any[], isLoading: boolean, error: Error | null, refetch: () => void) => React.ReactNode;
  onDataLoaded?: (data: any[]) => void;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
   
}