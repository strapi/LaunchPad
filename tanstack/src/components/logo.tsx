import { Link } from '@tanstack/react-router';

import { BlurImage } from './blur-image';
import { resolveStrapiMedia } from '@/lib/strapi/strapi-image';
import type { Image } from '@/types/types';

export const Logo = ({ image, locale }: { image?: Image; locale?: string }) => {
  if (!image) return null;

  return (
    <Link
      to="/$locale"
      params={{ locale: locale || 'en' }}
      className="font-normal flex items-center gap-3 text-sm mr-4 text-black relative z-20"
    >
      <BlurImage
        {...resolveStrapiMedia(image.url)}
        alt={image.alternativeText}
        width={200}
        height={200}
        className="h-10 w-10 rounded-xl"
      />
      <span className="text-white font-bold">LaunchPad</span>
    </Link>
  );
};
