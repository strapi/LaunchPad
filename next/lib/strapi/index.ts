import { strapi } from '@strapi/client';

export const strapiClient = strapi({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
});
