"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/elements/button";
import { NavbarItem } from "./navbar-item";
import {
  useMotionValueEvent,
  useScroll,
  motion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "next-view-transitions";
import { LocaleSwitcher } from "../locale-switcher";

export const DesktopNavbar = ({ 
  leftNavbarItems, 
  rightNavbarItems, 
  logo, 
  locale,
}: {
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
}) => {
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
        "w-full flex relative justify-between px-4 rounded-md  transition duration-200 bg-transparent mx-auto"
      )}
      animate={{
        width: showBackground ? "80%" : "100%",
        background: showBackground ? "var(--slate-200)" : "transparent",
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        <Logo locale={locale} image={logo?.image} />
        <div className="flex items-center gap-1.5">
          {leftNavbarItems.map((item) => (
            <NavbarItem href={`/${locale}${item.URL}` as never} key={item.text} target={item.target}>
              {item.text}
            </NavbarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <LocaleSwitcher currentLocale={locale} />

        {rightNavbarItems.map((item, index) => (
          <Button key={item.text} variant={index === rightNavbarItems.length - 1 ? 'primary' : 'simple'} as={Link} href={`/${locale}${item.URL}`}>
            {item.text}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
