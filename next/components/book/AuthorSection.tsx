import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function AuthorSection() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            
            {/* Author Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-6xl font-bold">PS</span>
                    </div>
                    <p className="text-sm opacity-70">Professional photo placeholder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <Badge variant="outline" className="mb-4">About the Author</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  Dr. Peter Sung
                </h2>
                <p className="text-xl text-cyan-500 font-medium mb-6">
                  Executive Coach & Leadership Expert
                </p>
              </div>

              <div className="space-y-4 text-neutral-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  With over three decades of leadership study and practice, Dr. Peter Sung has become a trusted guide 
                  for executives navigating complexity and change. His unique integration of organizational psychology 
                  and performance science has helped thousands of leaders achieve breakthrough results.
                </p>
                <p>
                  Dr. Sung's work seamlessly bridges church and corporate domains, bringing a holistic perspective 
                  that addresses both the technical and human dimensions of leadership. As an avid learner and 
                  practitioner, he offers a calm, confident voice in the often-noisy landscape of leadership trends.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="text-3xl font-bold text-cyan-500 mb-1">4000+</div>
                  <div className="text-sm text-neutral-600 dark:text-gray-400">Hours of Coaching</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-500 mb-1">2000+</div>
                  <div className="text-sm text-neutral-600 dark:text-gray-400">Speaking Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-500 mb-1">30+</div>
                  <div className="text-sm text-neutral-600 dark:text-gray-400">Years Experience</div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Link
                  href="/about"
                  className="inline-block px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-full transition-colors"
                >
                  Full Bio
                </Link>
                <Link
                  href="/coaching"
                  className="inline-block px-6 py-3 text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                >
                  Work with Dr. Sung →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
