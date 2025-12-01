'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useState } from 'react';

import { BlurImage } from '../blur-image';
import { LocaleSwitcher } from '../locale-switcher';
import { NavbarItem } from './navbar-item';
// import { Logo } from '@/components/logo';
import { Button as ElementButton } from '@/components/elements/button';
import { LogoLarge } from '@/components/large-logo';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { Icon, LinkItem } from '@/types/utils';
import { Typography } from '../ui/typography';

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
  upNavbarItems: {
    icon?: Icon;
    heading: string;
    sub_heading: string;
    links: LinkItem[];
  };
};

export const DesktopNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  upNavbarItems,
}: Props) => {
  const { scrollY } = useScroll();

  // console.log({ upNavbarItems });

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <motion.div
      className={cn(
        // 'mx-auto w-full flex relative justify-between rounded-md  transition duration-200'
        'mx-auto w-full flex flex-col relative rounded-md  transition duration-200'
      )}
      animate={{
        width: showBackground ? '80%' : '100%',
        background: showBackground ? 'var(--neutral-900)' : 'transparent',
      }}
      transition={{
        duration: 0.4,
      }}
    >
      {/* <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full bg-neutral-900 pointer-events-none mask-[linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence> */}
      {upNavbarItems && (
        <div
          className={cn('flex w-full bg-[#D9D9D9] justify-between p-2   ', {
            'hidden transition-all duration-150': showBackground,
          })}
        >
          <div className="flex gap-17 items-center text-center px-20 text-black">
            <Typography className="text-sm">{upNavbarItems.heading}</Typography>
            <span className="flex gap-1 text-sm">
             
              {upNavbarItems.icon?.image?.url && (
                <BlurImage
                  src={strapiImage(upNavbarItems.icon?.image?.url)}
                  alt={upNavbarItems.icon.image?.alternativeText || ''}
                  width={18}
                  height={18}
                  className=""
                />
              )}
              {upNavbarItems.sub_heading}
            </span>
          </div>

          <div className="flex items-center gap-3 text-black px-27">
            {upNavbarItems.links.map((item) => (
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
                ) : 
                <>{item.text}</>
                }
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-beetween bg-white w-full">
        <div className="flex flex-row justify-around gap-2 items-center p-4 w-full ">
          <LogoLarge locale={locale} image={logo?.image} />
          <div className="flex items-center justify-center gap-2 space-x-3">
            {leftNavbarItems.map((item) => (
              <NavbarItem
                href={`/${locale}${item.URL}` as never}
                key={item.text}
                target={item.target}
              >
                {item.text}
              </NavbarItem>
            ))}
          </div>
        </div>
        {/* <div className="flex space-x-2 items-center">
        <LocaleSwitcher currentLocale={locale} />

        {rightNavbarItems.map((item, index) => (
          <ElementButton
            key={item.text}
            variant={
              index === rightNavbarItems.length - 1 ? 'primary' : 'simple'
            }
            as={Link}
            href={`/${locale}${item.URL}`}
          >
            {item.text}
          </ElementButton>
        ))}
      </div> */}
      </div>
    </motion.div>
  );

};
