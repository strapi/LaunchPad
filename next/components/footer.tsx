import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Typography } from './ui/typography';
import { Logo } from '@/components/logo';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import ImgFooter from '@/public/rectangle.svg';
import { Image } from '@/types/types';
import { LinkItem } from '@/types/utils';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { StrapiImage } from './ui/strapi-image';

export const Footer = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  

  // const bg_image = StrapiImage(data.background.url)

   const bg_image = data.background?.url?strapiImage(data.background.url):null;
  
  return (
    <div
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: bg_image ? `url(${bg_image})` : 'none',
      }}
    >
      <div className="border-t border-neutral-900 px-8 pt-20 pb-4 relative">
        <div className="max-w-6xl grid mx-auto text-sm sm:grid-cols-3  items-start justify-items-center">
          <div>
            <div className="mr-4  md:flex mb-4">
              {/* {data?.logo?.image && <Logo image={data?.logo?.image} />} */}
              <Typography variant="h3">Webtinix</Typography>
            </div>
            <div className="max-w-xs">{data?.description}</div>
            <div className="flex flex-col justify-around mt-4">
              <div className="flex flex-col gap-2">
                <span>Téléphone</span>
                <Input className="rounded-none opacity-80 text-black"></Input>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <span>Email</span>
                <Input className="rounded-none opacity-80 text-black"></Input>
              </div>
              <Button className="bg-[#0038A1] mt-4 w-4/5 p-6">
                Contactez-nous
              </Button>
            </div>

            {/* <div className="mt-4">{data?.copyright}</div> */}
          </div>
          {/* <div className=" gap-10 items-start mt-10 md:mt-0">
          </div> */}
          {/* BLOC 2 */}
          <div>
            <Typography variant="h3">Navigation</Typography>
            <LinkSection links={data?.internal_links} locale={locale} />
          </div>

            {/* BLOC 3 */}
          <div className=''>
            <Typography variant="h3">Contact</Typography>
            <LinkSection links={data?.policy_links} locale={locale} />
            <div className="flex flex-col gap-4 mt-4"><BlocksRenderer content={data.contact} /></div>
          </div>
        </div>
        <div className="flex flex-col">
          {/* RS */}
          <div className="flex gap-4 items-center justify-center mt-28 mb-3">
            <Typography className="text-sm">Suivez nous</Typography>
            <div className="flex gap-4">
              {data?.social_media_links?.map((item: LinkItem) => (
                <Link
                  target={item.target}
                  href={`${item.URL.startsWith('http') ? '' : `/${locale}`}${item.URL}`}
                  key={item.id}
                >
                  {item.icon?.image?.url ? (
                    <BlurImage
                      src={strapiImage(item.icon.image.url)}
                      alt={item.icon.image.alternativeText || ''}
                      width={18}
                      height={18}
                      className=""
                    />
                  ) : (
                    <>{item.text}</>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <hr className="border-t-3 border-dashed border-white" />
          <div className="flex gap-1 items-center justify-center mt-6">
            {data?.copyright}
          </div>
        </div>
      </div>
      {/* BLOC 1 */}
      <div className="w-full text-center bg-white text-primary  relative">
         <Typography className="text-6xl z-10 relative font-black text-[#0038A1]">{data.designed_developed_by}</Typography>
        <BlurImage
          src={ImgFooter}
          alt="rectangle"
          className="absolute inset-0 size-full z-0 object-cover"
        />
       
      </div>
    </div>
  );
};

const LinkSection = ({
  links,
  locale,
  ...props
}: {
  links: { text: string; URL: never | string }[];
  locale: string;
  class?: string;
}) => (
  <div
    className={cn('flex justify-center space-y-4 flex-col mt-4', props.class)}
  >
    {links.map((link) => (
      <Link
        key={link.text}
        className="transition-colors hover:text-neutral-400 text-muted text-xs sm:text-sm"
        href={`${link.URL.startsWith('http') ? '' : `/${locale}`}${link.URL}`}
      >
        {link.text}
      </Link>
    ))}
  </div>
);
