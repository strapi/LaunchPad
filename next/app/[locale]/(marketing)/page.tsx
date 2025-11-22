import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { HeroSection } from '@/components/HeroSection';
import { FeatureCard } from '@/components/FeatureCard';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  try {
    const pageData = await fetchContentType(
      'pages',
      {
        filters: {
          slug: 'homepage',
          locale: params.locale,
        },
        populate: 'seo.metaImage',
      },
      true
    );

    const seo = pageData?.seo;
    return generateMetadataObject(seo);
  } catch (e) {
    return {
      title: "Dr. Peter Sung | SecureBase",
      description: "Leadership coaching and organizational design."
    };
  }
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  let pageData = null;

  try {
    pageData = await fetchContentType(
      'pages',
      {
        filters: {
          slug: 'homepage',
          locale: params.locale,
        },
      },
      true
    );
  } catch (error) {
    console.warn("Strapi unreachable or empty, rendering fallback UI.");
  }

  // If Strapi has content, render it
  if (pageData && pageData.dynamic_zone && pageData.dynamic_zone.length > 0) {
    const localizedSlugs = pageData.localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = '';
        return acc;
      },
      { [params.locale]: '' }
    );

    return (
      <>
        <ClientSlugHandler localizedSlugs={localizedSlugs} />
        <PageContent pageData={pageData} />
      </>
    );
  }

  // FALLBACK: Render the "Steve Krug" Design directly
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        title="SecureBase: Leadership for the Future"
        subtitle="Empowering leaders with the psychological safety and strategic clarity needed to navigate complexity."
        ctaText="Start Your Journey"
        ctaLink="/contact"
      />
      
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Offerings</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive solutions designed to transform your leadership capability and organizational culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Executive Coaching"
              description="Personalized guidance for high-stakes decision making. Unlock your potential through deep, evidence-based coaching methodologies."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Organizational Design"
              description="Structuring teams for agility and resilience. We help you build systems that scale without losing the human element."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <FeatureCard 
              title="Keynote Speaking"
              description="Inspiring talks on leadership, culture, and innovation. Engage your audience with insights that challenge the status quo."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
