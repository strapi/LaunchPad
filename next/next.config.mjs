import path from "path";
import rehypePrism from "@mapbox/rehype-prism";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import createNextIntlPlugin from "next-intl/plugin";
import { withContentlayer } from 'next-contentlayer2';


const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withContentlayer(withNextIntl(withMDX(nextConfig)));
