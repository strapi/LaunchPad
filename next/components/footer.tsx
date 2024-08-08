import React from "react";
import { Logo } from "@/components/logo";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

export const Footer = async ({ locale }: { locale?: string }) => {
  const t = await getTranslations("footer");
  const links = [
    {
      name: t("pricing"),
      href: "/pricing",
    },
    {
      name: t("blog"),
      href: "/blog",
    },
    {
      name: t("products"),
      href: "/products",
    },
    {
      name: t("faq"),
      href: "/faq",
    },
    {
      name: t("contact"),
      href: "/contact",
    },
    {
      name: t("signup"),
      href: "/sign-up",
    },
  ];
  const legal = [
    {
      name: t("privacy"),
      href: "#",
    },
    {
      name: t("terms"),
      href: "#",
    },
    {
      name: t("refund"),
      href: "#",
    },
  ];
  const socials = [
    {
      name: "Twitter",
      href: "https://twitter.com/mannupaaji",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/manuarora28",
    },
    {
      name: "GitHub",
      href: "https://github.com/manuarora700",
    },
  ];
  return (
    <div className="relative">
      <div className="border-t border-neutral-900 px-8 pt-20 pb-32 relative bg-primary">
        <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start ">
          <div>
            <div className="mr-4  md:flex mb-4">
              <Logo />
            </div>
            <div className="max-w-xs">{t("description")}</div>
            <div className="mt-4">Copyright &copy; 2024 Proactiv INC</div>
            <div className="mt-10">
              Designed and Developed by{" "}
              <a className="text-white underline" href="https://aceternity.com">
                Aceternity
              </a>
            </div>
            <div className="mt-2">
              built with{" "}
              <a className="text-white underline" href="https://nextjs.org">
                Next.js
              </a>
              ,{" "}
              <a
                className="text-white underline"
                href="https://tailwindcss.com"
              >
                Tailwind CSS
              </a>
              ,{" "}
              <a
                className="text-white underline"
                href="https://framer.com/motion"
              >
                Framer Motion
              </a>
              , and{" "}
              <a
                className="text-white underline"
                href="https://ui.aceternity.com"
              >
                Aceternity UI
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {socials.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
