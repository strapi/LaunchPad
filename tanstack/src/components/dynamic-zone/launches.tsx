import { IconRocket } from '@tabler/icons-react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { StickyScroll } from '@/components/ui/sticky-scroll';

export const Launches = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading: string;
  launches: Array<any>;
}) => {
  const launchesWithDecoration = launches.map((entry) => ({
    ...entry,
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        {entry.mission_number}
      </p>
    ),
  }));

  return (
    <div className="w-full relative h-full pt-20 md:pt-40 bg-charcoal">
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="mt-4">{heading}</Heading>
        <Subheading>{sub_heading}</Subheading>
      </div>
      <StickyScroll content={launchesWithDecoration} />
    </div>
  );
};
