"use client";

import StarBackground from "@/components/decorations/star-background";
import ShootingStars from "@/components/decorations/shooting-star";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

import { Button } from "../elements/button";

export function FormNextToSection({ heading, sub_heading, form, section, social_media_icon_links }: { heading: string, sub_heading: string, form: any, section: any, social_media_icon_links: any }) {

  const socials = [
    {
      title: "twitter",
      href: "https://twitter.com/strapijs",
      icon: (
        <IconBrandX className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
    {
      title: "github",
      href: "https://github.com/strapi",
      icon: (
        <IconBrandGithub className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
    {
      title: "linkedin",
      href: "https://linkedin.com/strapi",
      icon: (
        <IconBrandLinkedin className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20  xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-white">
              {heading}
            </h1>
            <p className="mt-4 text-muted   text-sm max-w-sm">
              {sub_heading}
            </p>
          </div>

          <div className="py-10">
            <div>
              <form
                className="space-y-4"
              >
                {form && form?.inputs?.map((input: any) => (
                  <>
                    {input.type !== 'submit' && (
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-neutral-400 "
                      >
                        {input.name}
                      </label>
                    )}

                    <div className="mt-2">
                      {input.type === 'textarea' ? (
                        <textarea
                          rows={5}
                          id="message"
                          placeholder={input.placeholder}
                          className="block w-full bg-neutral-900  px-4 rounded-md border-0 py-1.5  shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 "
                        />
                      ) : input.type === 'submit' ? (
                        <div>
                          <Button className="w-full mt-6">{input.name}</Button>
                        </div>
                      ) :
                        <input
                          id="name"
                          type={input.type}
                          placeholder={input.placeholder}
                          className="block w-full bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 "
                        />
                      }
                    </div>
                  </>
                ))}
              </form>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 py-4">
            {socials.map((social) => (
                <Link href={social.href} target="_blank" key={social.title}>
                  {social.icon}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="relative w-full z-20 hidden md:flex border-l border-charcoal overflow-hidden bg-neutral-900 items-center justify-center">
        <StarBackground />
        <ShootingStars />
        <div className="max-w-sm mx-auto">
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={section.users} />
          </div>
          <p
            className={
              "font-semibold text-xl text-center  text-muted text-balance"
            }
          >
            {section.heading}
          </p>
          <p
            className={
              "font-normal text-base text-center text-neutral-500  mt-8 text-balance"
            }
          >
            {section.sub_heading}
          </p>
        </div>
      </div>
    </div>

  );
}
