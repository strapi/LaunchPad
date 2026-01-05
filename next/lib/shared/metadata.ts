import { strapiImage } from '../strapi/strapiImage';

export function generateMetadataObject(seo: any) {
  return {
    title: seo?.metaTitle || 'Webtinix', // Fallback to 'Default Title' if title is not provided
    description: seo?.metaDescription || 'Nous concevons et développons pour vous des sites internet, des logiciels, des applications web et Android ainsi que d’autres services complémentaires dans le cadre du digital.', // Fallback to 'Default Description'
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description:
        seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      images: seo?.metaImage ? [{ url: strapiImage(seo?.metaImage.url) }] : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description:
        seo?.twitterDescription ||
        seo?.metaDescription ||
        'Default Twitter Description',
      images: seo?.twitterImage ? [{ url: seo.twitterImage }] : [],
    },
  };
}
