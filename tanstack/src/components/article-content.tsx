import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { ComponentProps } from 'react';

import { BlurImage } from './blur-image';
import { getStrapiSource } from '@/lib/strapi/source-map';
import { normalizeStrapiMediaUrl, stripStegaMarkers } from '@/lib/utils';

type BlockComponents = NonNullable<
  ComponentProps<typeof BlocksRenderer>['blocks']
>;

/**
 * Blocks content stores the media URL captured in the authoring environment,
 * which for local uploads is a relative `/uploads/...` path. Rendered as-is it
 * resolves against the frontend origin and 404s, so it has to be rebuilt
 * against the current Strapi host.
 */
const ImageBlock: BlockComponents['image'] = ({ image }) => (
  <BlurImage
    src={normalizeStrapiMediaUrl(image.url)}
    alt={stripStegaMarkers(image.alternativeText || image.name)}
    width={image.width}
    height={image.height}
    className="rounded-lg"
    // Decode from the raw url before normalizeStrapiMediaUrl cleans it, so the
    // preview overlay can map this block image back to its media field.
    data-strapi-source={getStrapiSource(image.url)}
  />
);

export const ArticleContent = ({ content }: { content: BlocksContent }) => {
  return <BlocksRenderer content={content} blocks={{ image: ImageBlock }} />;
};
