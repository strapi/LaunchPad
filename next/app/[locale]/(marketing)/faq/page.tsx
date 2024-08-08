import { type Metadata } from "next";
import { Container } from "@/components/container";
import { Heading } from "@/components/elements/heading";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { IconHelpHexagonFilled } from "@tabler/icons-react";
import seoData from "@/lib/next-metadata";
import getFAQs from "@/constants/faq";
import { CTA } from "@/components/cta";
import { AmbientColor } from "@/components/decorations/ambient-color";
import { Locale } from "@/config";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "FAQs | " + seoData.title,
  description: seoData.description,
  openGraph: {
    images: seoData.openGraph.images,
  },
};

export default async function FAQsPage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations('FAQ');
  const FAQs = getFAQs(params.locale);
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconHelpHexagonFilled className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {t("title")}
          </Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20">
          {FAQs.map((faq, idx) => (
            <div key={faq.question}>
              <h4 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                {faq.question}
              </h4>
              <p className="mt-4 text-neutral-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
      <CTA />
    </div>
  );
}
