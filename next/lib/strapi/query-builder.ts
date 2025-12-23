import type { DataSourceConfig } from '@/types/data-source';
import type { API } from '@strapi/client';

export const buildStrapiOptions = (config: DataSourceConfig): API.BaseQueryParams => {
  const options: API.BaseQueryParams = {};

  // Filtres - Format Strapi natif
  if (config.filters) {
    options.filters = config.filters;
  }

  // Tri
  if (config.sort) {
    options.sort = config.sort;
  }

  // Population des relations
  if (config.populate) {
    options.populate = config.populate;
  }

  // Pagination
  if (config.pagination) {
    options.pagination = config.pagination;
  }

  // Champs à récupérer
  if (config.fields) {
    options.fields = config.fields;
  }

  // Locale
  if (config.locale) {
    options.locale = config.locale;
  }

  // Publication state
  if (config.publicationState) {
    options.status = config.publicationState;
  }

  return options;
};

export const buildQueryKey = (config: DataSourceConfig): string[] => {
  return [
    config.collection,
    config.documentId || 'collection',
    JSON.stringify(config.filters || {}),
    JSON.stringify(config.sort || []),
    JSON.stringify(config.populate || null),
    JSON.stringify(config.pagination || {}),
    JSON.stringify(config.fields || []),
    config.locale || 'default',
  ];
};