import { IconHelpHexagonFilled } from '@tabler/icons-react';

import { FeatureIconContainer } from './features/feature-icon-container';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
}: {
  heading: string;
  sub_heading: string;
  faqs: any[];
}) => {
  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      <div className="relative z-20 py-10 md:pt-32 text-center">
        <FeatureIconContainer>
          <IconHelpHexagonFilled className="h-6 w-6 text-brand-200" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-4 text-center" size="xl">
          {heading}
        </Heading>
        {sub_heading && (
          <Subheading className="mx-auto mt-4 max-w-2xl text-center text-base text-text-subtle">
            {sub_heading}
          </Subheading>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2">
        {faqs?.map((faq: { question: string; answer: string }) => (
          <div
            key={faq.question}
            className="rounded-3xl border border-border/60 bg-surface/70 p-6 text-left shadow-card backdrop-blur-sm"
          >
            <h4 className="text-base font-semibold text-text-primary">
              {faq.question}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
};
