import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../elements/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface CasUtudeHeaderProps {
  heading: string;
  sub_heading: string;
  title_items_cas: string;
  items_cas_utilisation: ItemsCasUtilisation[];
  button: Button[];
  image: Image;
  locale: string;
}

export interface Button {
  id: number;
  text: string;
  URL: string;
  target: null | string;
  variant: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface ItemsCasUtilisation {
  id: number;
  title: string;
  description: string;
}

export function CasUtudeHeader({
  heading,
  button,
  image,
  items_cas_utilisation,
  sub_heading,
  title_items_cas,
  locale,
}: CasUtudeHeaderProps) {
  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 space-y-10">
      <div className="flex flex-col space-y-2 text-start border-b border-gray-500 pb-4">
        <Typography variant="h2" className="text-primary">
          {heading}
        </Typography>
        <Typography as="p">{sub_heading}</Typography>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex flex-col w-full lg:w-1/3 border border-gray-300 shadow overflow-hidden">
          <div className="w-full bg-primary px-4 py-3">
            <Typography as="h3" className="text-white">
              {title_items_cas}
            </Typography>
          </div>

          <div className="p-4 space-y-4">
            {items_cas_utilisation.map((el, index) => (
              <div key={index} className="flex flex-col gap-1">
                <Typography as="span" className="text-gray-800">
                  {el.title}
                </Typography>
                <Typography
                  as="span"
                  className="text-gray-600 border-t border-black"
                >
                  {el.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-2/3 space-y-6">
          <Image
            src={strapiImage(image?.url)}
            alt={image.alternativeText ?? ''}
            width={1200}
            height={600}
            className="rounded-lg object-cover w-full h-auto"
          />

          <div className="flex flex-wrap items-start gap-3">
            {button.map((el, index) => (
              <Button
                as={Link}
                key={index}
                href={`/${locale}${el.URL}`}
                variant={el.variant as any}
                className={`py-3 px-5 ${el.variant === 'primary' && 'bg-primary hover:bg-primary border-0 text-white'}`}
              >
                {el.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
