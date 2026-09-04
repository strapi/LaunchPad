import type { BlocksContent } from '@strapi/blocks-react-renderer';

import type { StrapiLocaleObject } from '@/types/strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
  mime?: string;
}

export interface Article {
  title: string;
  description?: string | null;
  localizations: Array<StrapiLocaleObject>;
  slug: string;
  content: BlocksContent;
  dynamic_zone: Array<any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Array<Category>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: Array<any>;
  perks: Array<any>;
  dynamic_zone: Array<any>;
  featured?: boolean;
  images: Array<any>;
  categories?: Array<any>;
  localizations?: Array<any>;
}
