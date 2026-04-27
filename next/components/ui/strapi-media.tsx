import { API_URL } from '@/lib/utils';
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
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;

  return API_URL + url;
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

  if (mime?.startsWith('video/')) {
    const url = getStrapiMedia(src);
    if (!url) return null;
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className={className}
        {...videoProps}
      />
    );
  }

  if (mime?.startsWith('audio/')) {
    const url = getStrapiMedia(src);
    if (!url) return null;
    return (
      <audio src={url} controls className={className} {...audioProps} />
    );
  }

  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return (
    <Image
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      className={className}
      {...imageProps}
    />
  );
}
