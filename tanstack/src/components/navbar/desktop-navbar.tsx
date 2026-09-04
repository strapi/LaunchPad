import { Link } from '@tanstack/react-router';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useState } from 'react';

import { LocaleSwitcher } from '../locale-switcher';
import { LogoutButton } from '../logout-button';
import { NavbarItem } from './navbar-item';
import { Button } from '@/components/elements/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import type { TAuthUser } from '@/types/auth';

type NavItem = {
  URL: string;
  text: string;
  target?: string;
};

type Props = {
  leftNavbarItems: Array<NavItem>;
  rightNavbarItems: Array<NavItem>;
  logo: any;
  locale: string;
  currentUser?: TAuthUser | null;
};

export const DesktopNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  currentUser,
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
        'w-full flex relative justify-between px-4 py-3 rounded-md  transition duration-200 bg-transparent mx-auto'
      )}
      animate={{
        width: showBackground ? '80%' : '100%',
        backgroundColor: showBackground
          ? 'rgb(23, 23, 23)'
          : 'rgba(23, 23, 23, 0)',
      }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full bg-neutral-900 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo locale={locale} image={logo?.image} />
        <div className="flex items-center gap-1.5">
          {leftNavbarItems.map((item) => (
            <NavbarItem
              href={`/${locale}${item.URL}`}
              key={item.text}
              target={item.target}
            >
              {item.text}
            </NavbarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <LocaleSwitcher currentLocale={locale} />

        {currentUser ? (
          // Logged-in state: show the user's name + logout button in place of
          // the Strapi-configured right nav items (which are anonymous CTAs
          // like "Book a demo" / "Sign up").
          <>
            <span className="text-sm text-white px-3 py-2 hidden xl:inline">
              Hi, <span className="font-medium">{currentUser.username}</span>
            </span>
            <LogoutButton locale={locale} />
          </>
        ) : (
          <>
            <Link
              to={`/${locale}/sign-in` as any}
              className="text-sm text-white px-4 py-2 hover:text-neutral-300 transition-colors"
            >
              Sign in
            </Link>
            {rightNavbarItems.map((item, index) => (
              <Button
                key={item.text}
                variant={
                  index === rightNavbarItems.length - 1 ? 'primary' : 'simple'
                }
                as={Link}
                to={`/${locale}${item.URL}` as any}
              >
                {item.text}
              </Button>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};
