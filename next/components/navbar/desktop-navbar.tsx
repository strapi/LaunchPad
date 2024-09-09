"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/elements/button";
import { NavbarItem } from "./navbar-item";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "@/navigation";
import { LocaleSwitcher } from "../locale-switcher";
import { Locale } from "@/config";
import { useTranslations } from "next-intl";

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
  onChangeLocale: (locale: Locale) => void;
};

export const DesktopNavbar = ({ leftNavbarItems, rightNavbarItems, logo, onChangeLocale }: Props) => {
  const t = useTranslations("Navbar");
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <motion.div
      className={cn(
        "w-full flex relative justify-between px-4 py-3 rounded-md  transition duration-200 bg-transparent mx-auto"
      )}
      animate={{
        width: showBackground ? "80%" : "100%",
        background: showBackground ? "var(--neutral-900)" : "transparent",
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full bg-neutral-900 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo image={logo?.image} />
        <div className="flex items-center gap-1.5">
          {leftNavbarItems.map((item) => (
            <NavbarItem href={item.URL} key={item.text} target={item.target}>
              {item.text}
            </NavbarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <LocaleSwitcher onChange={onChangeLocale} />

        {rightNavbarItems.map((item, index) => (
          <Button key={item.text} variant={index === rightNavbarItems.length - 1 ? 'primary' : 'simple'} as={Link} href={item.URL}>
            {item.text}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};