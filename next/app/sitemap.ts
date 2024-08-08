import { allBlogPosts } from "@/.contentlayer/generated";
import { getAllProducts } from "@/lib/product";
import { MetadataRoute } from "next";

const locales = ["en", "es", "fr"]; // Add your supported locales here
const URL = `https://ui.aceternity.com`;

type SitemapEntry = {
  url: string;
  lastModified: string | Date;
  changeFrequency:
    | "yearly"
    | "monthly"
    | "weekly"
    | "daily"
    | "hourly"
    | "always"
    | "never";
  priority: number;
};

function generateLocalizedUrl(path: string, locale: string): string {
  return locale === "en" ? `${URL}${path}` : `${URL}/${locale}${path}`;
}

function generateStaticPages(): SitemapEntry[] {
  const pages = [
    { path: "", changeFrequency: "yearly" as const, priority: 1 },
    { path: "/products", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/sign-up", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return locales.flatMap((locale) =>
    pages.map(({ path, changeFrequency, priority }) => ({
      url: generateLocalizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );
}

function generateBlogEntries(): SitemapEntry[] {
  return locales.flatMap((locale) =>
    allBlogPosts.map((blog) => ({
      url: generateLocalizedUrl(`${blog.url}`, locale),
      lastModified: blog.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );
}

function generateProductEntries(products: any[]): SitemapEntry[] {
  return locales.flatMap((locale) =>
    products.map((product) => ({
      url: generateLocalizedUrl(`/products/${product.slug}`, locale),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProducts = await getAllProducts();

  return [
    ...generateStaticPages(),
    ...generateBlogEntries(),
    ...generateProductEntries(allProducts),
  ];
}
