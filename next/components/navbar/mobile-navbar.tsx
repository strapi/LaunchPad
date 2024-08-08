"use client";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/elements/button";
import { Logo } from "@/components/logo";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { LocaleSwitcher } from "../locale-switcher";
import { Locale } from "@/config";

type Props = {
  navItems: {
    link: string;
    title: string;
    target?: "_blank";
  }[];
  onChangeLocale: (locale: Locale) => void;
};

export const MobileNavbar = ({ navItems, onChangeLocale }: Props) => {
  const [open, setOpen] = useState(false);

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
    <div
      className={cn(
        "flex justify-between bg-transparent items-center w-full rounded-md px-2.5 py-1.5 transition duration-200",
        showBackground &&
          " bg-neutral-900  shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <Logo />

      <IoIosMenu
        className="text-white h-6 w-6"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-start space-y-10  pt-5  text-xl text-zinc-600  transition duration-200 hover:text-zinc-800">
          <div className="flex items-center justify-between w-full px-5">
            <Logo />
            <div className="flex items-center space-x-2">
              <LocaleSwitcher onChange={onChangeLocale} />
              <IoIosClose
                className="h-8 w-8 text-white"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {navItems.map((navItem: any, idx: number) => (
              <>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map((childNavItem: any, idx: number) => (
                      <Link
                        key={`link=${idx}`}
                        href={childNavItem.link}
                        onClick={() => setOpen(false)}
                        className="relative max-w-[15rem] text-left text-2xl"
                      >
                        <span className="block text-white">
                          {childNavItem.title}
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    onClick={() => setOpen(false)}
                    className="relative"
                  >
                    <span className="block text-[26px] text-white">
                      {navItem.title}
                    </span>
                  </Link>
                )}
              </>
            ))}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5  px-8 py-4 ">
            <Button as={Link} href="/contact">
              Book a demo
            </Button>
            <Button
              variant="simple"
              as={Link}
              href="/sign-up"
              onClick={() => {
                setOpen(false);
              }}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
