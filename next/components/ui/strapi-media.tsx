import { API_URL, stripStegaMarkers } from '@/lib/utils';
import { getStrapiSource } from '@/lib/strapi/sourceMap';
import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';
import {
  AudioHTMLAttributes,
  ComponentProps,
  VideoHTMLAttributes,
} from 'react';

interface StrapiMediaProps
  extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt?: string | null;
  mime?: string | null;
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'className'>;
  audioProps?: Omit<AudioHTMLAttributes<HTMLAudioElement>, 'src' | 'className'>;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  const cleanUrl = stripStegaMarkers(url);
  if (cleanUrl.startsWith('data:')) return cleanUrl;
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('//')) return cleanUrl;

  return API_URL + cleanUrl;
}

/**
 * Renders a Strapi media field. Branches on `mime` so video/audio assets
 * get the right element instead of being fed to next/image (which can't
 * render them). Falls back to next/image when mime is absent or image-like.
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
  noStore();

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
    <Image
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      className={className}
      data-strapi-source={strapiSource}
      {...imageProps}
    />
  );
}
