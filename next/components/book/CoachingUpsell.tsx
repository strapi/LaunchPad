'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPhone, IconUsers, IconBriefcase, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

const packages = [
  {
    icon: IconPhone,
    name: 'Discovery Call',
    price: 'Free',
    duration: '30 minutes',
    description: 'Explore how coaching could accelerate your leadership journey',
    features: [
      'Assessment of current challenges',
      'Discussion of your leadership goals',
      'Overview of coaching process',
      'No obligation or pressure',
    ],
    cta: 'Schedule Discovery Call',
    href: '/coaching#discovery',
  },
  {
    icon: IconBriefcase,
    name: 'Executive Coaching',
    price: 'Custom',
    duration: '3-12 months',
    description: 'One-on-one partnership for sustainable leadership transformation',
    features: [
      'Bi-weekly 1-hour sessions',
      'Personalized development plan',
      '360° feedback integration',
      'Unlimited email support',
    ],
    cta: 'Learn More',
    href: '/coaching#executive',
    popular: true,
  },
  {
    icon: IconUsers,
    name: 'Team Workshop',
    price: 'Custom',
    duration: 'Half or full day',
    description: 'Build secure base leadership capabilities across your team',
    features: [
      'Customized to your context',
      'Interactive exercises',
      'Practical frameworks',
      'Follow-up resources',
    ],
    cta: 'Inquire About Workshop',
    href: '/coaching#team-workshop',
  },
];

export function CoachingUpsell() {
  return (
    <section className="py-24 bg-gradient-to-b from-cyan-50 to-white dark:from-zinc-900 dark:to-charcoal">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Ready to Go Deeper?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-3xl mx-auto">
              The book provides the frameworks—coaching brings them to life. Work directly with Dr. Sung 
              to accelerate your transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <Card 
                  key={index}
                  className={`relative transition-all hover:shadow-xl hover:-translate-y-1 ${
                    pkg.popular 
                      ? 'border-2 border-cyan-500' 
                      : 'border-2 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-cyan-500" />
                    </div>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-cyan-500">{pkg.price}</span>
                      <span className="text-sm text-neutral-500 dark:text-gray-400">{pkg.duration}</span>
                    </div>
                    <CardDescription className="text-base">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-cyan-500 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={pkg.href} className="block">
                      <Button 
                        variant={pkg.popular ? 'default' : 'outline'}
                        className="w-full"
                      >
                        {pkg.cta}
                        <IconArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bundle Offer */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Book + Coaching Bundle
                  </h3>
                  <p className="text-neutral-600 dark:text-gray-300">
                    Preorder the signed book today and receive <strong>20% off your first coaching package</strong>. 
                    Apply the frameworks with expert guidance from day one.
                  </p>
                </div>
                <Button size="lg" className="whitespace-nowrap">
                  Claim Bundle Offer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 dark:text-gray-500 mb-4">
              Join 500+ executives who've experienced transformation through Dr. Sung's coaching
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-cyan-500">98%</div>
                <div className="text-neutral-600 dark:text-gray-400">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-500">4.9/5</div>
                <div className="text-neutral-600 dark:text-gray-400">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-500">4000+</div>
                <div className="text-neutral-600 dark:text-gray-400">Coaching Hours</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
