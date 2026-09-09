import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Image wrapper that starts blurred and fades in on load.
 *
 * Replacement for Next's `next/image` blur-up placeholder. The tricky part:
 * when the browser has the image already cached, the native `onLoad` event
 * never fires after React hydration — so we additionally check `img.complete`
 * on mount to clear the blur for cached images. Without this, cached images
 * stay permanently blurred.
 */
export const BlurImage = ({
  src,
  width,
  height,
  alt,
  className,
  ...rest
}: BlurImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (ref.current?.complete) {
      setLoading(false);
    }
  }, [src]);

  return (
    <img
      ref={ref}
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ?? 'Avatar'}
      {...rest}
    />
  );
};
