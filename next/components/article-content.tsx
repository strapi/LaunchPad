'use client';

import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';
import type { ComponentProps } from 'react';

import { BlurImage } from './blur-image';
import { normalizeStrapiMediaUrl, stripStegaMarkers } from '@/lib/utils';

type BlockComponents = NonNullable<
  ComponentProps<typeof BlocksRenderer>['blocks']
>;

const ImageBlock: BlockComponents['image'] = ({ image }) => (
  <BlurImage
    src={normalizeStrapiMediaUrl(image.url)}
    alt={stripStegaMarkers(image.alternativeText || image.name)}
    width={image.width}
    height={image.height}
    className="rounded-lg"
  />
);

export const ArticleContent = ({ content }: { content: BlocksContent }) => {
  return <BlocksRenderer content={content} blocks={{ image: ImageBlock }} />;
};
