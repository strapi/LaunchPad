import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager'

export default function PageContent({ pageData }: { pageData: any }) {
  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      {pageData?.dynamic_zone && (<DynamicZoneManager dynamicZone={pageData?.dynamic_zone} />)}
    </div>
  );
}
