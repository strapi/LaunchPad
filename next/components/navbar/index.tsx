"use client";
import { useTransition } from "react";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { Locale } from "@/config";

export function Navbar() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("Navbar");
  function onChange(value: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: value }
      );
    });
  }

  const navItems = [
    {
      title: t("pricing"),
      link: "/pricing",
    },
    {
      title: t("products"),
      link: "/products",
    },

    {
      title: t("blog"),
      link: "/blog",
    },
    {
      title: t("contact"),
      link: "/contact",
    },
    {
      title: t("faq"),
      link: "/faq",
    },
  ];

  return (
    <motion.nav
      // initial={{
      //   y: -80,
      // }}
      // animate={{
      //   y: 0,
      // }}
      // transition={{
      //   ease: [0.6, 0.05, 0.1, 0.9],
      //   duration: 0.8,
      // }}
      className="max-w-7xl  fixed top-4  mx-auto inset-x-0 z-50 w-[95%] lg:w-full"
    >
      <div className="hidden lg:block w-full">
        <DesktopNavbar onChangeLocale={onChange} navItems={navItems} />
      </div>
      <div className="flex h-full w-full items-center lg:hidden ">
        <MobileNavbar onChangeLocale={onChange} navItems={navItems} />
      </div>
    </motion.nav>
  );
}

{
  /* <div className="hidden md:block ">
        <DesktopNavbar />
      </div>
      <div className="flex h-full w-full items-center md:hidden ">
        <MobileNavbar navItems={navItems} />
      </div> */
}
