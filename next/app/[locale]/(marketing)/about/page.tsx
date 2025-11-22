import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Dr. Peter Sung | SecureBase Leadership Coaching',
  description: 'With over three decades of leadership study and experience, Dr. Peter Sung guides leaders and organizations to find stability and success.',
};

// Stats data
const stats = [
  { value: '4000+', label: 'Hours of Coaching', sublabel: 'Leaders at all levels' },
  { value: '2000+', label: 'Speaking Events', sublabel: 'Conferences, retreats, and more' },
  { value: '30+', label: 'Years Experience', sublabel: 'Leadership expertise' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
              About
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Meet Dr. Peter Sung
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              A trusted guide for leaders navigating complexity with clarity and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent z-10" />
                {/* Placeholder for profile image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">PS</span>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Leadership Refined Through Experience
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  With over three decades of leadership study and experience, Dr. Peter Sung has honed his craft as a leader. Seamlessly navigating both church and corporate domains, he integrates performance and organizational psychology into his coaching and speaking practice.
                </p>
                <p>
                  He expertly guides leaders and organizations to find stability and success in an ever-changing world. As an avid learner and practitioner, he brings a calm and confident voice to the often-noisy landscape of leadership trends.
                </p>
                <p>
                  Dr. Sung&apos;s holistic approach blends profound psychological expertise with sharp organizational insights, establishing him as a highly sought-after mentor and speaker in personal and organizational leadership.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all duration-200 hover:scale-[1.02]"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Proven Track Record
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Decades of experience transforming leaders and organizations across industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-all duration-300">
                    <div className="text-5xl md:text-6xl font-bold text-cyan-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xl font-semibold text-white mb-1">
                      {stat.label}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {stat.sublabel}
                    </div>
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Philosophy
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              The SecureBase Approach
            </h2>
            <blockquote className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-light italic">
              &ldquo;I speak <span className="text-cyan-400">to</span> leaders and <span className="text-cyan-400">into</span> their lives. It all starts with self-awareness.&rdquo;
            </blockquote>
            <p className="mt-8 text-gray-400 max-w-2xl mx-auto">
              A secure base is the foundation from which leaders can explore, take risks, and grow.
              Dr. Sung provides that foundation through evidence-based coaching methodologies and
              deep psychological insight.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Take the first step towards becoming the leader you were meant to be.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all duration-200 hover:scale-[1.02]"
              >
                Schedule a Discovery Call
              </Link>
              <Link
                href="/coaching"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                Explore Coaching
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
