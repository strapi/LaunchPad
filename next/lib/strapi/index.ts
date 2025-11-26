import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { draftMode } from 'next/headers';

export const getCollectionType = async <T = API.Document[]>(
  collectionName: string,
  collectionOptions: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
) => {
  const { isEnabled: isDraftMode } = await draftMode();

  const { data } = await strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
    ...config,
  })
    .collection(collectionName)
    .find({
      ...collectionOptions,
      status: isDraftMode ? 'draft' : 'published',
    });

  return data as T;
};

export const getSingleType = async <T = API.Document>(
  singleTypeName: string,
  singleTypeOptions?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
) => {
  const { isEnabled: isDraftMode } = await draftMode();

  const { data } = await strapi({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
    ...config,
  })
    .single(singleTypeName)
    .find({
      ...singleTypeOptions,
      status: isDraftMode ? 'draft' : 'published',
    });

  return data as T;
};
