import { AmbientColor } from "@/components/decorations/ambient-color";
import { Brands } from "@/components/brands";
import { CTA } from "@/components/cta";
import { Pricing } from "@/components/pricing";
import seoData from "@/lib/next-metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - " + seoData.title,
  description: seoData.description,
  openGraph: {
    title: seoData.openGraph.title,
    description: seoData.openGraph.description,
    images: seoData.openGraph.images,
  },
};
export default function PricingPage() {
  return (
    <div className="relative overflow-hidden  w-full">
      <AmbientColor />
      <div className="pt-40">
        <Pricing />
      </div>
      <Brands />
      <CTA />
    </div>
  );
}
