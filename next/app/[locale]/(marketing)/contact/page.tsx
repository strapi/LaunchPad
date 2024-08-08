import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ContactForm } from "@/components/contact";
import seoData from "@/lib/next-metadata";
import StarBackground from "@/components/decorations/star-background";
import ShootingStars from "@/components/decorations/shooting-star";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { AmbientColor } from "@/components/decorations/ambient-color";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact Us - " + seoData.title,
  description: seoData.description,
  openGraph: {
    title: "Contact Us - " + seoData.title,
    description: seoData.description,
    images: seoData.openGraph.images,
  },
};

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");
  return (
    <div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-charcoal">
      <AmbientColor />
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <ContactForm />
        <div className="relative w-full z-20 hidden md:flex border-l border-charcoal overflow-hidden bg-neutral-900 items-center justify-center">
          <StarBackground />
          <ShootingStars />
          <div className="max-w-sm mx-auto">
            <FeaturedTestimonials />
            <p
              className={cn(
                "font-semibold text-xl text-center  text-muted text-balance"
              )}
            >
              {t("title")}
            </p>
            <p
              className={cn(
                "font-normal text-base text-center text-neutral-500  mt-8 text-balance"
              )}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
