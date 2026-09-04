import React from 'react';

import { Brands } from './brands';
import { CTA } from './cta';
import { FAQ } from './faq';
import { Features } from './features';
import { FormNextToSection } from './form-next-to-section';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { Launches } from './launches';
import { Pricing } from './pricing';
import { RelatedArticles } from './related-articles';
import { RelatedProducts } from './related-products';
import { Testimonials } from './testimonials';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: Array<DynamicZoneComponent>;
  locale: string;
}

// Static mapping of Strapi dynamic-zone component UIDs to React components.
// We static-import (not React.lazy) so all blocks SSR-render in a single pass.
// Blocks that internally use client-only code (e.g. three.js globe, canvas particles)
// are wrapped in <ClientOnly> at the leaf level.
const componentMapping: { [key: string]: React.ComponentType<any> } = {
  'dynamic-zone.hero': Hero,
  'dynamic-zone.features': Features,
  'dynamic-zone.testimonials': Testimonials,
  'dynamic-zone.how-it-works': HowItWorks,
  'dynamic-zone.brands': Brands,
  'dynamic-zone.pricing': Pricing,
  'dynamic-zone.launches': Launches,
  'dynamic-zone.cta': CTA,
  'dynamic-zone.faq': FAQ,
  'dynamic-zone.form-next-to-section': FormNextToSection,
  'dynamic-zone.related-articles': RelatedArticles,
  'dynamic-zone.related-products': RelatedProducts,
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.__component];
        if (!Component) {
          console.warn(`No component found for: ${componentData.__component}`);
          return null;
        }
        return (
          <Component
            key={`${componentData.__component}-${componentData.id}-${index}`}
            {...componentData}
            locale={locale}
          />
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
