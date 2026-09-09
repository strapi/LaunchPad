import type { Article, Global, Page, Product } from './strapi';

/**
 * What `/api/preview-content` returns.
 *
 * Lives in `shared/` because both sides need it: the server route produces it
 * and the `/preview/[...path]` page consumes it. A page importing from
 * `server/` would type-check but drag server code into the client bundle.
 */
export type PreviewResolved =
  | { kind: 'page'; page: Page }
  | { kind: 'article'; article: Article }
  | { kind: 'product'; product: Product }
  | { kind: 'blog-index'; articles: Article[]; heading?: string | null }
  | { kind: 'product-index'; products: Product[]; heading?: string | null }
  | null;

export interface PreviewPayload {
  /** False when the draft cookie is missing or the locale is not one of ours. */
  allowed: boolean;
  locale: string;
  global: Global | null;
  resolved: PreviewResolved;
}
