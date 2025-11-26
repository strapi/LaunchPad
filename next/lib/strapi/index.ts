import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { draftMode } from 'next/headers';

export const getCollection = async (
  collectionName: string,
  collectionOptions: API.BaseQueryParams,
  locale?: string,
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
      locale,
    });

  return data;
};

export const getSingleType = async (
  singleTypeName: string,
  singleTypeOptions: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>,
  locale?: string
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
      locale,
    });

  return data;
};
