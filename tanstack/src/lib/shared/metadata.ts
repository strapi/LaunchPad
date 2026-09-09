import { strapiImage } from '@/lib/strapi/strapi-image';

/**
 * Build a TanStack Router `head()` meta array from a Strapi SEO component.
 * Replaces Next's `generateMetadataObject` which returned a Next Metadata object.
 */
export function buildSeoMeta(seo: any): Array<Record<string, string>> {
  const title = seo?.metaTitle || 'Default Title';
  const description = seo?.metaDescription || 'Default Description';
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const ogImage = seo?.metaImage?.url
    ? strapiImage(seo.metaImage.url)
    : undefined;
  const twitterCard = seo?.twitterCard || 'summary_large_image';
  const twitterTitle = seo?.twitterTitle || title;
  const twitterDescription = seo?.twitterDescription || description;
  // Strapi stores twitterImage as a plain URL string, not a media object —
  // matching how Next's `generateMetadataObject` reads it.
  const twitterImage = seo?.twitterImage;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { name: 'twitter:card', content: twitterCard },
    { name: 'twitter:title', content: twitterTitle },
    { name: 'twitter:description', content: twitterDescription },
  ];

  if (ogImage) {
    meta.push({ property: 'og:image', content: ogImage });
  }

  if (twitterImage) {
    meta.push({ name: 'twitter:image', content: twitterImage });
  }

  return meta;
}
