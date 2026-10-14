import { strapiFetch } from './strapi';
import { localeMarket, type Locale } from '@/i18n.config';

export const getGlobal = (locale: Locale) => strapiFetch('/global', { locale });
export const getHeader = (locale: Locale) => strapiFetch('/header', { locale });
export const getFooter = (locale: Locale) => strapiFetch('/footer', { locale });

/** A published, non-default banner wins; otherwise the default one linked from Global. */
export async function getPromoBanner(locale: Locale) {
  const [banners, global] = await Promise.all([
    strapiFetch<any[]>('/promo-banners', { locale, 'filters[isDefault][$eq]': 'false', 'sort': 'updatedAt:desc' }),
    getGlobal(locale),
  ]);
  const live = banners?.find((b) => b.publishedAt);
  if (live) return live;
  if (!global?.defaultPromoBanner?.documentId) return null;
  const def = await strapiFetch<any[]>('/promo-banners', { locale, 'filters[documentId][$eq]': global.defaultPromoBanner.documentId });
  return def?.[0] ?? null;
}

export const getProducts = (locale: Locale) => strapiFetch<any[]>('/products', { locale, 'sort': 'createdAt:asc' });

export async function getProduct(locale: Locale, slug: string) {
  const list = await strapiFetch<any[]>('/products', { locale, 'filters[slug][$eq]': slug });
  const product = list?.[0] ?? null;
  if (product?.documents) {
    const market = localeMarket[locale];
    product.documents = product.documents.filter((d: any) => market === 'group' || d.market === market || d.market === 'group');
  }
  return product;
}

export const getPage = async (locale: Locale, slug: string) => (await strapiFetch<any[]>('/pages', { locale, 'filters[slug][$eq]': slug }))?.[0] ?? null;

export const getNews = (locale: Locale) => strapiFetch<any[]>('/news-items', { locale, 'sort': 'publishedOn:desc' });
export const getNewsItem = async (locale: Locale, slug: string) => (await strapiFetch<any[]>('/news-items', { locale, 'filters[slug][$eq]': slug }))?.[0] ?? null;
export const getPressReleases = () => strapiFetch<any[]>('/press-releases', { 'sort': 'publishedOn:desc' });
export const getPressRelease = async (slug: string) => (await strapiFetch<any[]>('/press-releases', { 'filters[slug][$eq]': slug }))?.[0] ?? null;
