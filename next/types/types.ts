import type { BlocksContent } from '@strapi/blocks-react-renderer';

import type { StrapiLocaleObject } from '@/types/strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description: string;
  localizations: StrapiLocaleObject[];
  slug: string;
  content: BlocksContent;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  dynamic_zone: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
}

export type LocaleParamsProps = {
  params: Promise<{
    locale: string;
  }>;
};

export type LocaleSlugParamsProps = {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
};
