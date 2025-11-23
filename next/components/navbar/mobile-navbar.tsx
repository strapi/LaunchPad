'use client';

import { useMotionValueEvent, useScroll, motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useState, useEffect } from 'react';

import { LocaleSwitcher } from '../locale-switcher';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '@/components/elements/button';
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

// Animated hamburger component
const AnimatedHamburger = ({ open, onClick }: { open: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <motion.span
        className="block h-0.5 w-5 bg-white rounded-full"
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 6 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span
        className="block h-0.5 w-5 bg-white rounded-full my-1"
        animate={{
          opacity: open ? 0 : 1,
          scaleX: open ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-0.5 w-5 bg-white rounded-full"
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -6 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.button>
  );
};

// Menu animation variants
const menuVariants: Variants = {
  closed: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -20,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const backdropVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <div
        className={cn(
          'flex justify-between bg-transparent items-center w-full rounded-md px-2.5 py-1.5 transition duration-200',
          showBackground &&
            'bg-neutral-900/95 backdrop-blur-md shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]'
        )}
      >
        <Logo image={logo?.image} />
        <AnimatedHamburger open={open} onClick={() => setOpen(!open)} />
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Menu Panel - slides up from bottom for one-handed use */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-x-0 bottom-0 top-auto max-h-[85vh] bg-gradient-to-t from-black via-neutral-900 to-neutral-900/95 backdrop-blur-xl z-50 rounded-t-3xl overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drag handle indicator */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between w-full px-6 pb-4 border-b border-white/10">
                <Logo locale={locale} image={logo?.image} />
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <LocaleSwitcher currentLocale={locale} />
                  <AnimatedHamburger open={open} onClick={() => setOpen(false)} />
                </div>
              </div>

              {/* Navigation Links - scrollable area */}
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col items-start gap-1 px-6">
                  {leftNavbarItems.map((navItem: any, idx: number) => (
                    <motion.div key={`nav-${idx}`} variants={menuItemVariants}>
                      {navItem.children && navItem.children.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {navItem.children.map((childNavItem: any, childIdx: number) => (
                            <Link
                              key={`child-${childIdx}`}
                              href={`/${locale}${childNavItem.URL}`}
                              onClick={() => setOpen(false)}
                              className="group block py-3 px-4 rounded-xl hover:bg-white/5 transition-all active:scale-[0.98]"
                            >
                              <span className="text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                                {childNavItem.text}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={`/${locale}${navItem.URL}`}
                          onClick={() => setOpen(false)}
                          className="group block py-3 px-4 rounded-xl hover:bg-white/5 transition-all active:scale-[0.98] w-full"
                        >
                          <span className="text-2xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {navItem.text}
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* CTA Buttons - fixed at bottom for easy thumb access */}
              <motion.div
                variants={menuItemVariants}
                className="px-6 py-6 border-t border-white/10 bg-black/50 safe-area-inset-bottom"
              >
                <div className="flex flex-col gap-3">
                  {rightNavbarItems.map((item, index) => (
                    <Button
                      key={item.text}
                      variant={index === rightNavbarItems.length - 1 ? 'primary' : 'simple'}
                      as={Link}
                      href={`/${locale}${item.URL}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "w-full py-4 text-lg font-medium rounded-xl transition-all active:scale-[0.98]",
                        index === rightNavbarItems.length - 1
                          ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      )}
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
