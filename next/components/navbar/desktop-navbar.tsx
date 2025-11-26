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
import { LogoLarge } from '@/components/large-logo';
import { strapiImage } from '@/lib/strapi/strapiImage';
// import { Logo } from '@/components/logo';
import { Button as ElementButton } from '@/components/elements/button';
import { cn } from '@/lib/utils';
import { Image } from '@/types/types';

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
    icon?: { image: Image; title: string };
    heading: string;
    sub_heading: string;
    links: any[];
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

  console.log({ upNavbarItems });

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
      <div
        className={cn('flex w-full px-24 bg-[#D9D9D9] justify-between', {
          'hidden transition-all duration-150': showBackground,
        })}
      >
        <div className="flex gap-6 text-sm items-center text-center text-black">
          <span>{upNavbarItems.heading}</span>
          <span className="flex gap-2">
            {/* image */}
            {upNavbarItems.icon && (
              <BlurImage
                src={strapiImage(upNavbarItems.icon?.image?.url)}
                alt={upNavbarItems.icon.image?.alternativeText}
                width={20}
                height={20}
                className=""
              />
            )}
            {upNavbarItems.sub_heading}
          </span>
        </div>

        <div className="flex gap-1">
          {upNavbarItems.links.map((item) => (
           <div key={item.text}>{item.text}</div>
          ))}
        </div>
      </div>
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
