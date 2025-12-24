import Image from 'next/image';

import { strapiImage } from '@/lib/strapi/strapiImage';

export interface ImagesGridProps {
  images: GridImage[];
}

export interface GridImage {
  url: string;
  alternativeText: string | null;
}

export function ImagesGrid({ images }: ImagesGridProps) {
  if (!images || images.length === 0) return null;

  // Découpe les images en pattern: (pair -> solo -> pair -> solo...)
  const groups: (GridImage[] | GridImage)[] = [];
  let i = 0;

  while (i < images.length) {
    // Pair: deux images
    if (i + 1 < images.length) {
      groups.push([images[i], images[i + 1]]);
      i += 2;
    } else {
      // Reste 1 image → solo
      groups.push(images[i]);
      i += 1;
    }

    // Solo si encore 1 image ensuite
    if (i < images.length) {
      groups.push(images[i]);
      i += 1;
    }
  }

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-10 flex flex-col items-center">
      <div className="bg-tertiare w-full py-16 px-6 flex justify-center items-center">
        <div className="w-full max-w-6xl space-y-4">
          {groups.map((group, index) => {
            if (Array.isArray(group)) {
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {group.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-full overflow-hidden rounded-lg shadow aspect-[16/9]"
                    >
                      <Image
                        src={strapiImage(img.url)}
                        alt={img.alternativeText ?? ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={index}
                className="relative w-full overflow-hidden rounded-lg shadow aspect-[16/9]"
              >
                <Image
                  src={strapiImage(group.url)}
                  alt={group.alternativeText ?? ''}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
