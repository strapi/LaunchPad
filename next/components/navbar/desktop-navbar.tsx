'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useState } from 'react';

import { LocaleSwitcher } from '../locale-switcher';
import { ThemeToggle } from '../theme-toggle';
import { NavbarItem } from './navbar-item';
import { Button } from '@/components/elements/button';
import MagneticButton from '@/components/ui/MagneticButton';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

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
};

export const DesktopNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const { scrollY } = useScroll();

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
        'w-full flex relative justify-between px-6 py-3 rounded-full transition duration-200 mx-auto items-center'
      )}
      animate={{
        width: showBackground ? '90%' : '100%',
        backgroundColor: showBackground ? 'rgba(23, 23, 23, 0.8)' : 'transparent',
        backdropFilter: showBackground ? 'blur(12px)' : 'blur(0px)',
        border: showBackground ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        boxShadow: showBackground ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        <Logo locale={locale} image={logo?.image} />
        <div className="flex items-center gap-1.5">
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
      <div className="flex space-x-2 items-center">
        <ThemeToggle />
        <LocaleSwitcher currentLocale={locale} />

        {rightNavbarItems.map((item, index) => (
          <MagneticButton key={item.text}>
            <Button
              variant={
                index === rightNavbarItems.length - 1 ? 'primary' : 'simple'
              }
              as={Link}
              href={`/${locale}${item.URL}`}
            >
              {item.text}
            </Button>
          </MagneticButton>
        ))}
      </div>
    </motion.div>
  );
};
