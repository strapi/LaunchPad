import { Container } from "@/components/container";
import { Heading } from "@/components/elements/heading";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { IconHelpHexagonFilled } from "@tabler/icons-react";

export const FAQ = ({ heading, sub_heading, faqs }: { heading: string, sub_heading: string, faqs: any[] }) => {
  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      <div className="relative z-20 py-10 md:pt-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconHelpHexagonFilled className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-4">
          {heading}
        </Heading>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20">
        {faqs && faqs.map((faq: { question: string, answer: string }) => (
          <div key={faq.question}>
            <h4 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
              {faq.question}
            </h4>
            <p className="mt-4 text-neutral-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};
