import { Metadata } from 'next';
import Link from 'next/link';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import { HeroSection } from '@/components/HeroSection';
import { FeatureCard } from '@/components/FeatureCard';
import LandingIntro from '@/components/LandingIntro';
import ProjectsGrid from '@/components/ProjectsGrid';
import { IconUsers, IconBuilding, IconMicrophone, IconArrowRight, IconQuote } from '@tabler/icons-react';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  try {
    const [pageData] = await fetchCollectionType('pages', {
      filters: {
        slug: {
          $eq: 'homepage',
        },
        locale: params.locale,
      },
    });

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
    const [data] = await fetchCollectionType('pages', {
      filters: {
        slug: {
          $eq: 'homepage',
        },
        locale: params.locale,
      },
    });
    pageData = data;
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
    <LandingIntro>
      <div className="flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Hero Section */}
        <HeroSection />

      {/* Stats Section */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 drop-shadow-sm">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Offerings Section */}
        <section className="py-24 bg-background-secondary border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
                Services
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Core Offerings
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
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

        {/* Projects Grid Section */}
        <ProjectsGrid />

        {/* Quote Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <IconQuote className="w-12 h-12 text-primary/30 mx-auto mb-8" />
              <blockquote className="text-2xl md:text-3xl lg:text-4xl text-foreground font-display font-light leading-relaxed mb-8">
                I speak <span className="text-primary font-normal">to</span> leaders and <span className="text-primary font-normal">into</span> their lives. It all starts with self-awareness.
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">PS</span>
                </div>
                <div className="text-left">
                  <p className="text-foreground font-semibold">Dr. Peter Sung</p>
                  <p className="text-muted-foreground text-sm">Founder, SecureBase</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Ready to Transform Your Leadership?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Take the first step towards becoming the leader you were meant to be. Schedule a free discovery call today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Schedule Discovery Call
                  <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground border border-border hover:bg-muted/50 rounded-full transition-all duration-300"
                >
                  Learn About Dr. Sung
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingIntro>
  );
}
