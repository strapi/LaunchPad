import React from 'react';
import dynamic from 'next/dynamic';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  [key: string]: any;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
}

const componentMapping: { [key: string]: any } = {
  'dynamic-zone.hero': dynamic(() => import('../dynamic-zone/hero').then(mod => mod.Hero), { ssr: false }),
  'dynamic-zone.features': dynamic(() => import('../dynamic-zone/features').then(mod => mod.Features), { ssr: false }),
  // 'dynamic-zone.testimonials': dynamic(() => import('../components/dynamic-zone/testimonials')),
  // 'dynamic-zone.how-it-works': dynamic(() => import('../components/dynamic-zone/how-it-works')),
  // 'dynamic-zone.brands': dynamic(() => import('../components/dynamic-zone/brands')),
  // 'dynamic-zone.pricing': dynamic(() => import('../components/dynamic-zone/pricing')),
  // 'dynamic-zone.launches': dynamic(() => import('../components/dynamic-zone/launches')),
  // 'dynamic-zone.cta': dynamic(() => import('../components/dynamic-zone/cta'))
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone }) => {
  return (
    <div>
      {
        dynamicZone.map((componentData) => {
          const Component = componentMapping[componentData.__component];
          if (!Component) {
            console.warn(`No component found for: ${componentData.__component}`);
            return null;
          }
          return <Component key={componentData.id} {...componentData} />;
        })}
    </div>
  );
};

export default DynamicZoneManager;
