'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

const componentMapping: { [key: string]: any } = {
  'dynamic-zone.hero': dynamic(() => import('./hero').then((mod) => mod.Hero)),
  'dynamic-zone.features': dynamic(() =>
    import('./features').then((mod) => mod.Features)
  ),
  'dynamic-zone.testimonials': dynamic(() =>
    import('./testimonials').then((mod) => mod.Testimonials)
  ),
  'dynamic-zone.how-it-works': dynamic(() =>
    import('./how-it-works').then((mod) => mod.HowItWorks)
  ),
  'dynamic-zone.brands': dynamic(() =>
    import('./brands').then((mod) => mod.Brands)
  ),
  'dynamic-zone.pricing': dynamic(() =>
    import('./pricing').then((mod) => mod.Pricing)
  ),
  'dynamic-zone.launches': dynamic(() =>
    import('./launches').then((mod) => mod.Launches)
  ),
  'dynamic-zone.cta': dynamic(() => import('./cta').then((mod) => mod.CTA)),
  'dynamic-zone.form-next-to-section': dynamic(() =>
    import('./form-next-to-section').then((mod) => mod.FormNextToSection)
  ),
  'dynamic-zone.faq': dynamic(() => import('./faq').then((mod) => mod.FAQ)),
  'dynamic-zone.related-products': dynamic(() =>
    import('./related-products').then((mod) => mod.RelatedProducts)
  ),
  'dynamic-zone.related-articles': dynamic(() =>
    import('./related-articles').then((mod) => mod.RelatedArticles)
  ),
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
