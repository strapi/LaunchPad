import { Link } from '@tanstack/react-router';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useState } from 'react';
import { IoIosClose, IoIosMenu } from 'react-icons/io';

import { LocaleSwitcher } from '../locale-switcher';
import { LogoutButton } from '../logout-button';
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

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  currentUser,
}: Props) => {
  const [open, setOpen] = useState(false);
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
    <div
      className={cn(
        'flex justify-between bg-transparent items-center w-full rounded-md px-2.5 py-1.5 transition duration-200',
        showBackground &&
          ' bg-neutral-900  shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]'
      )}
    >
      <Logo image={logo?.image} locale={locale} />

      <IoIosMenu
        className="text-white h-6 w-6"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-start space-y-10  pt-5  text-xl text-zinc-600  transition duration-200 hover:text-zinc-800">
          <div className="flex items-center justify-between w-full px-5">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <LocaleSwitcher currentLocale={locale} />
              <IoIosClose
                className="h-8 w-8 text-white"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {leftNavbarItems.map((navItem: any, idx: number) => (
              <React.Fragment key={`nav-${idx}`}>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map(
                      (childNavItem: any, childIdx: number) => (
                        <Link
                          key={`link-${idx}-${childIdx}`}
                          to={`/${locale}${childNavItem.URL}` as any}
                          onClick={() => setOpen(false)}
                          className="relative max-w-[15rem] text-left text-2xl"
                          suppressHydrationWarning
                        >
                          <span className="block text-white">
                            {childNavItem.text}
                          </span>
                        </Link>
                      )
                    )}
                  </>
                ) : (
                  <Link
                    to={`/${locale}${navItem.URL}` as any}
                    onClick={() => setOpen(false)}
                    className="relative"
                    suppressHydrationWarning
                  >
                    <span className="block text-[26px] text-white">
                      {navItem.text}
                    </span>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5  px-8 py-4 ">
            {currentUser ? (
              <div className="flex flex-col gap-3 w-full">
                <p className="text-sm text-white">
                  Signed in as{' '}
                  <span className="font-medium">{currentUser.username}</span>
                </p>
                <LogoutButton locale={locale} />
              </div>
            ) : (
              rightNavbarItems.map((item, index) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
