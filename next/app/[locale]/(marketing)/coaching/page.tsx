import { Metadata } from 'next';
import Link from 'next/link';
import { IconEye, IconRocket, IconBrain, IconArrowRight, IconCheck } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Executive Coaching | Dr. Peter Sung - SecureBase',
  description: 'Personalized executive coaching to help leaders increase awareness, gain agency, and take meaningful action. Transform your leadership journey.',
};

// The 3 A's methodology
const methodology = [
  {
    icon: IconEye,
    title: 'Awareness',
    subtitle: 'See clearly',
    description: 'What\'s really going on, with you personally or at work? Coaching will help leaders increase their awareness and emotional intelligence, and identify intention-impact gaps.',
    benefits: [
      'Gain clarity on blind spots',
      'Build emotional intelligence',
      'Understand intention-impact gaps',
      'Develop self-awareness',
    ],
  },
  {
    icon: IconRocket,
    title: 'Agency',
    subtitle: 'Take control',
    description: 'The key is to get started, by doing the first thing, however small. Awareness, accountability, and meaningful action makes the difference!',
    benefits: [
      'Build confidence to act',
      'Create accountability structures',
      'Overcome analysis paralysis',
      'Develop decision-making skills',
    ],
  },
  {
    icon: IconBrain,
    title: 'Action',
    subtitle: 'Move forward',
    description: 'You need a caring outsider because hope shows up when people who care show up. You don\'t have to be alone. Connect with a caring coach today!',
    benefits: [
      'Implement lasting change',
      'Track progress and wins',
      'Navigate obstacles',
      'Achieve measurable results',
    ],
  },
];

// Coaching packages
const packages = [
  {
    name: 'Discovery Session',
    price: 'Free',
    description: 'A 30-minute introductory call to discuss your goals and see if we\'re a good fit.',
    features: [
      '30-minute video call',
      'Goal assessment',
      'Coaching approach overview',
      'No obligation',
    ],
    cta: 'Schedule Free Call',
    highlighted: false,
  },
  {
    name: 'Executive Coaching',
    price: 'Custom',
    description: 'Comprehensive coaching program tailored to your specific leadership challenges.',
    features: [
      'Bi-weekly 60-minute sessions',
      'Assessments & diagnostics',
      'Between-session support',
      '360 feedback integration',
      'Action plan development',
      'Progress tracking',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Team Workshop',
    price: 'Custom',
    description: 'Half or full-day intensive sessions for leadership teams seeking alignment.',
    features: [
      'Team assessments',
      'Facilitated discussions',
      'Conflict resolution',
      'Goal alignment',
      'Follow-up support',
    ],
    cta: 'Inquire Now',
    highlighted: false,
  },
];

export default function CoachingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Coaching
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Everyone Needs a Coach
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              Rediscover your strengths, identify roadblocks, get past feeling stuck, and work towards your goals with personal, executive coaching.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all duration-200 hover:scale-[1.02]"
              >
                Start Your Journey
              </Link>
              <a
                href="#methodology"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                Learn the Approach
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Your Coach as Your Secure Base
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Your coach will become your trusted secure base, seeing you on a transformative journey of learning, growth, and achievement. You will think better thoughts and level-up with coaching!
            </p>
          </div>
        </div>
      </section>

      {/* The 3 A's Methodology */}
      <section id="methodology" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
                Methodology
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The 3 A&apos;s Framework
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A proven approach to leadership transformation built on three foundational pillars.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {methodology.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300"
                >
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xl border border-cyan-500/20">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-cyan-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-cyan-400 text-sm font-medium mb-4">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-400 mb-6">
                    {item.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-3">
                    {item.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-start gap-3">
                        <IconCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
                Services
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Coaching Options
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Choose the engagement model that fits your needs. All programs are customized to your specific goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 transition-all duration-300 ${
                    pkg.highlighted
                      ? 'bg-gradient-to-b from-cyan-500/10 to-cyan-500/5 border-2 border-cyan-500/30'
                      : 'bg-zinc-900/50 border border-white/5 hover:border-white/10'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-sm font-medium text-black">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-3xl font-bold text-cyan-400 mb-4">
                    {pkg.price}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    {pkg.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <IconCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      pkg.highlighted
                        ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {pkg.cta}
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Gain clarity, build confidence, and create a roadmap for your personal and professional success.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              Schedule Your Discovery Call
              <IconArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
