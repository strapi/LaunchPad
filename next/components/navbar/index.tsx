"use client";
import { useTransition } from "react";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { Locale } from "@/config";

export function Navbar({ data }: { data: any }) {

  const router = useRouter();
  const [_, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  function onChange(value: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: value }
      );
    });
  }

  return (
    <motion.nav
      className="max-w-7xl  fixed top-4  mx-auto inset-x-0 z-50 w-[95%] lg:w-full"
    >
      <div className="hidden lg:block w-full">
        {data?.left_navbar_items && (
          <DesktopNavbar onChangeLocale={onChange} leftNavbarItems={data?.left_navbar_items} rightNavbarItems={data?.right_navbar_items} logo={data?.logo} />
        )}

      </div>
      <div className="flex h-full w-full items-center lg:hidden ">
        {data?.left_navbar_items && (
          <MobileNavbar onChangeLocale={onChange} leftNavbarItems={data?.left_navbar_items} rightNavbarItems={data?.right_navbar_items} logo={data?.logo} />
        )}
      </div>
    </motion.nav>
  );
}