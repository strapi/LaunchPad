import React from "react";
import { Logo } from "@/components/logo";
import { Link } from "@/navigation";

export const Footer = async ({ data }: { data: any }) => {
  return (
    <div className="relative">
      <div className="border-t border-neutral-900 px-8 pt-20 pb-32 relative bg-primary">
        <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start ">
          <div>
            <div className="mr-4  md:flex mb-4">
              {data?.logo?.image && (
                <Logo image={data?.logo?.image} />
              )}
            </div>
            <div className="max-w-xs">{data?.description}</div>
            <div className="mt-4">{data?.copyright}</div>
            <div className="mt-10">
              Designed and Developed by{" "}
              <a className="text-white underline" href="https://aceternity.com">
                Aceternity
              </a>
              {" "}&{" "}
              <a className="text-white underline" href="https://strapi.io">
                Strapi
              </a>
            </div>
            <div className="mt-2">
              built with{" "}
              <a className="text-white underline" href="https://strapi.io">
                Strapi
              </a>
              ,{" "}
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
              {data?.internal_links.map((link: { text: string, URL: never; }) => (
                <Link
                  key={link.text}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.URL}
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {data?.policy_links.map((link: { text: string, URL: never; }) => (
                <Link
                  key={link.text}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.URL}
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {data?.social_media_links.map((link: { text: string, URL: never; }) => (
                <Link
                  key={link.text}
                  className="transition-colors hover:text-neutral-400 text-muted   text-xs sm:text-sm"
                  href={link.URL}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
