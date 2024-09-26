import { Link } from "next-view-transitions";
import React from "react";
import { BlurImage } from "@/components/blur-image";
import { Logo } from "./logo";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Article } from "@/types/types";

export const BlogCard = ({ article, locale }: { article: Article, locale: string }) => {
  return (
    <Link
      className="shadow-derek grid grid-cols-1 md:grid-cols-2  rounded-3xl group border border-transparent hover:border-neutral-800 w-full hover:bg-neutral-900  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/${locale}/blog/${article.slug}`}
    >
      <div className="">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url)}
            alt={article.title}
            height="1200"
            width="1200"
            className="h-full object-cover object-top w-full rounded-3xl"
          />
        ) : (
          <div className="h-full flex items-center justify-center group-hover:bg-neutral-900">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 group-hover:bg-neutral-900 flex flex-col justify-between">
        <div>
          <div className="flex gap-4 flex-wrap mb-4">
            {article.categories?.map((category, idx) => (
              <p
                key={`category-${idx}`}
                className="text-xs font-bold text-muted px-4 py-2 rounded-full bg-neutral-800 capitalize"
              >
                {category.name}
              </p>
            ))}
          </div>
          <p className="text-lg md:text-4xl font-bold mb-4">
            <Balancer>{article.title}</Balancer>
          </p>
          <p className="text-left text-base md:text-xl mt-2 text-muted">
            {truncate(article.description, 500)}
          </p>
        </div>
        <div className="flex space-x-2 items-center  mt-6">
          {/* <Image
            src={article.authorAvatar}
            alt={article.author}
            width={20}
            height={20}
            className="rounded-full h-5 w-5"
          /> */}
          {/* <p className="text-sm font-normal text-muted">{article.author}</p> */}
          <div className="h-1 w-1 bg-neutral-300 rounded-full"></div>
          <p className="text-neutral-300 text-sm  max-w-xl group-hover:text-white transition duration-200">
            {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const BlogCardVertical = ({ article, locale }: { article: Article, locale: string }) => {
  return (
    <Link
      className="shadow-derek   rounded-3xl group border border-transparent hover:border-neutral-800 w-full hover:bg-neutral-900  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/${locale}/blog/${article.slug}`}
    >
      <div className="">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url || "")}
            alt={article.title}
            height="800"
            width="800"
            className=" h-64 md:h-96 object-cover object-top w-full rounded-3xl"
          />
        ) : (
          <div className=" h-64 md:h-96 flex items-center justify-center group-hover:bg-neutral-900">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 group-hover:bg-neutral-900 flex flex-col justify-between">
        <div>
          <div className="flex gap-4 flex-wrap mb-4">
            {article.categories?.map((category, idx) => (
              <p
                key={`category-${idx}`}
                className="text-xs font-bold text-muted px-4 py-2 rounded-full bg-neutral-800 capitalize"
              >
                {category.name}
              </p>
            ))}
          </div>
          <p className="text-lg md:text-xl font-bold mb-4">
            <Balancer>{article.title}</Balancer>
          </p>
          <p className="text-left text-sm md:text-base mt-2 text-muted">
            {truncate(article.description, 500)}
          </p>
        </div>
        <div className="flex space-x-2 items-center  mt-6">
          {/* <Image
            src={article.authorAvatar}
            alt={article.author}
            width={20}
            height={20}
            className="rounded-full h-5 w-5"
          />
          <p className="text-sm font-normal text-muted">{article.author}</p> */}
          <div className="h-1 w-1 bg-neutral-300 rounded-full"></div>
          <p className="text-neutral-300 text-sm  max-w-xl group-hover:text-white transition duration-200">
            {format(new Date(article.publishedAt), "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );
};
