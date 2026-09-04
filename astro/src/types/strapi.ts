/** Shapes returned by LaunchPad's Strapi API, as this client consumes them. */

export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  name?: string;
  width?: number;
  height?: number;
  /** Present because LaunchPad's media fields accept videos as well as images. */
  mime?: string | null;
}

export interface Localization {
  locale: string;
  slug: string;
}

export interface Seo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  metaImage?: StrapiMedia | null;
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
}

export interface Category {
  name: string;
}

/** A node in a Strapi `blocks` (rich text) field. */
export interface BlockNode {
  type: string;
  children?: BlockNode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  level?: number;
  format?: 'ordered' | 'unordered';
  image?: StrapiMedia;
  language?: string;
}

/** One entry in a dynamic zone. `__component` selects the renderer. */
export interface DynamicZoneEntry {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export interface Page {
  documentId: string;
  slug: string;
  locale: string;
  seo?: Seo | null;
  dynamic_zone?: DynamicZoneEntry[];
  localizations?: Localization[];
}

export interface Article {
  documentId: string;
  title: string;
  description?: string | null;
  slug: string;
  locale: string;
  content: BlockNode[];
  image?: StrapiMedia | null;
  categories?: Category[];
  publishedAt: string;
  seo?: Seo | null;
  dynamic_zone?: DynamicZoneEntry[];
  localizations?: Localization[];
}

export interface Perk {
  text: string;
}

export interface Product {
  documentId: string;
  name: string;
  description?: string | null;
  slug: string;
  locale: string;
  price?: number | null;
  images?: StrapiMedia[];
  featured?: boolean;
  plans?: unknown[];
  perks?: Perk[];
  seo?: Seo | null;
  dynamic_zone?: DynamicZoneEntry[];
  localizations?: Localization[];
}

export interface NavbarLink {
  text: string;
  URL: string;
  target?: string | null;
  children?: NavbarLink[];
}

export interface Global {
  navbar?: {
    logo?: { image?: StrapiMedia | null } | null;
    left_navbar_items?: NavbarLink[];
    right_navbar_items?: NavbarLink[];
  } | null;
  footer?: {
    logo?: { image?: StrapiMedia | null } | null;
    description?: string | null;
    copyright?: string | null;
    internal_links?: NavbarLink[];
    policy_links?: NavbarLink[];
    social_media_links?: NavbarLink[];
  } | null;
  seo?: Seo | null;
}
