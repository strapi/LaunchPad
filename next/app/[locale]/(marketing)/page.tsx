import { Metadata } from 'next';
import Link from 'next/link';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { HeroSection } from '@/components/HeroSection';
import { FeatureCard } from '@/components/FeatureCard';
import { IconUsers, IconBuilding, IconMicrophone, IconArrowRight, IconQuote } from '@tabler/icons-react';

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
      title: "Dr. Peter Sung | SecureBase Leadership Coaching",
      description: "Empowering leaders with high-performance coaching, speaking, and assessments."
    };
  }
}

// Core offerings data
const offerings = [
  {
    title: "Executive Coaching",
    description: "Personalized guidance for high-stakes decision making. Unlock your potential through deep, evidence-based coaching methodologies.",
    icon: IconUsers,
    href: "/coaching",
  },
  {
    title: "Organizational Design",
    description: "Structuring teams for agility and resilience. Build systems that scale without losing the human element.",
    icon: IconBuilding,
    href: "/coaching",
  },
  {
    title: "Keynote Speaking",
    description: "Inspiring talks on leadership, culture, and innovation. Engage your audience with insights that challenge the status quo.",
    icon: IconMicrophone,
    href: "/contact",
  },
];

// Stats
const stats = [
  { value: "4000+", label: "Hours of Coaching" },
  { value: "2000+", label: "Speaking Events" },
  { value: "30+", label: "Years Experience" },
];

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

  // FALLBACK: Awwwards-level Design
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="SecureBase: Leadership for the Future"
        subtitle="Empowering leaders with the psychological safety and strategic clarity needed to navigate complexity and drive meaningful change."
        ctaText="Start Your Journey"
        ctaLink="/contact"
        secondaryCtaText="Explore Coaching"
        secondaryCtaLink="/coaching"
      />

      {/* Stats Section */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Services
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Core Offerings
            </h2>
            <p className="text-gray-400 text-lg">
              Comprehensive solutions designed to transform your leadership capability and organizational culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {offerings.map((offering, index) => (
              <FeatureCard
                key={index}
                title={offering.title}
                description={offering.description}
                icon={<offering.icon className="w-7 h-7" />}
                href={offering.href}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <IconQuote className="w-12 h-12 text-cyan-500/30 mx-auto mb-8" />
            <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed mb-8">
              I speak <span className="text-cyan-400">to</span> leaders and <span className="text-cyan-400">into</span> their lives. It all starts with self-awareness.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">PS</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Dr. Peter Sung</p>
                <p className="text-gray-400 text-sm">Founder, SecureBase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-900/50 to-charcoal border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Take the first step towards becoming the leader you were meant to be. Schedule a free discovery call today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]"
              >
                Schedule Discovery Call
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                Learn About Dr. Sung
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
