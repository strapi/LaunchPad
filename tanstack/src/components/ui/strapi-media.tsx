import React from 'react';

import { getStrapiSource } from '@/lib/strapi/source-map';
import { API_URL, stripStegaMarkers } from '@/lib/utils';

interface StrapiMediaProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt?: string | null;
  mime?: string | null;
  width?: number | string;
  height?: number | string;
  videoProps?: Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    'src' | 'className'
  >;
  audioProps?: Omit<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    'src' | 'className'
  >;
}

export function getStrapiMedia(url: string | null): string | null {
  if (url == null) return null;
  const cleanUrl = stripStegaMarkers(url);
  if (cleanUrl.startsWith('data:')) return cleanUrl;
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('//')) return cleanUrl;

  return API_URL + cleanUrl;
}

/**
 * Renders a Strapi media field. Branches on `mime` so video/audio assets get
 * the right element instead of being fed to <img> (which can't render them).
 * Falls back to <img> when mime is absent or image-like.
 *
 * The `article.image` and `product.images` fields both accept videos (and
 * `article.image` accepts audio too), so a media field is not safe to assume
 * is an image — pass `mime` wherever the media object is in scope.
 *
 * Port of the Next launchpad's `components/ui/strapi-media.tsx`.
 */
export function StrapiMedia({
  src,
  mime,
  alt,
  className,
  videoProps,
  audioProps,
  ...imageProps
}: Readonly<StrapiMediaProps>) {
  // Decode the visual-editing source from the raw URL *before* getStrapiMedia
  // strips the markers, and render it as a literal data attribute the preview
  // overlay reads directly. Undefined outside draft mode -> attribute omitted.
  const strapiSource = getStrapiSource(src);

  if (mime?.startsWith('video/')) {
    const url = getStrapiMedia(src);
    if (!url) return null;
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className={className}
        data-strapi-source={strapiSource}
        {...videoProps}
      />
    );
  }

  if (mime?.startsWith('audio/')) {
    const url = getStrapiMedia(src);
    if (!url) return null;
    return (
      <audio
        src={url}
        controls
        className={className}
        data-strapi-source={strapiSource}
        {...audioProps}
      />
    );
  }

  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return (
    <img
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      className={className}
      data-strapi-source={strapiSource}
      {...imageProps}
    />
  );
}
