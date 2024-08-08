import { AmbientColor } from '@/components/decorations/ambient-color';
import { Brands } from '@/components/brands';
import { CTA } from '@/components/cta';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { Launches } from '@/components/launched';
import { Pricing } from '@/components/pricing';
import { Testimonials } from '@/components/testimonials';
import DynamicZoneManager from '@/components/dynamic-zone/manager'

export default function PageContent({ pageData }: { pageData: any }) {
  console.log(pageData);

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      {pageData?.dynamic_zone && (<DynamicZoneManager dynamicZone={pageData?.dynamic_zone} />)}
      <Testimonials />
      <HowItWorks />
      <Brands />
      <Pricing />
      <Launches />
      <CTA />
    </div>
  );
}
