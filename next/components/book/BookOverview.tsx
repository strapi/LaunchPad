'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconEye, IconRocket, IconBrain } from '@tabler/icons-react';

const frameworks = [
  {
    icon: IconEye,
    title: 'Awareness',
    subtitle: 'See clearly what's really happening',
    description: 'Coaching helps leaders increase self-awareness and emotional intelligence, identify intention-impact gaps, and gain clarity on blind spots that hold them back.',
    benefits: [
      'Understand your leadership blind spots',
      'Build emotional intelligence',
      'Identify intention-impact gaps',
      'Develop deeper self-awareness',
    ],
  },
  {
    icon: IconRocket,
    title: 'Agency',
    subtitle: 'Reclaim your power to act',
    description: 'The key is to get started by doing the first thing, however small. Awareness, accountability, and meaningful action makes the difference. You don\'t have to be alone.',
    benefits: [
      'Take control of your leadership journey',
      'Build sustainable accountability systems',
      'Make decisions with confidence',
      'Create meaningful momentum',
    ],
  },
  {
    icon: IconBrain,
    title: 'Action',
    subtitle: 'Transform insight into impact',
    description: 'Hope shows up when people who care show up. Connect with practical strategies and frameworks that translate awareness and agency into tangible results for you and your organization.',
    benefits: [
      'Implement proven frameworks',
      'Navigate complex challenges',
      'Build high-performing teams',
      'Create lasting organizational change',
    ],
  },
];

export function BookOverview() {
  return (
    <section id="preview" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            The 3 A's Framework
          </h2>
          <p className="text-xl text-neutral-600 dark:text-gray-300 leading-relaxed">
            A proven methodology for leadership transformation, refined through thousands of hours 
            coaching executives across diverse industries and organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {frameworks.map((framework, index) => {
            const Icon = framework.icon;
            return (
              <Card 
                key={index}
                className="relative overflow-hidden border-2 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full" />
                
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-cyan-500" />
                  </div>
                  <CardTitle className="text-2xl">{framework.title}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {framework.subtitle}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 dark:text-gray-300">
                    {framework.description}
                  </p>
                  <ul className="space-y-2">
                    {framework.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-gray-400">
                        <span className="text-cyan-500 mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What You'll Learn */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                    For Individual Leaders
                  </h4>
                  <ul className="space-y-2 text-neutral-600 dark:text-gray-300">
                    <li>• How to build a personal secure base</li>
                    <li>• Overcoming leadership blind spots</li>
                    <li>• Making high-stakes decisions with clarity</li>
                    <li>• Developing authentic leadership presence</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                    For Organizations
                  </h4>
                  <ul className="space-y-2 text-neutral-600 dark:text-gray-300">
                    <li>• Creating psychologically safe cultures</li>
                    <li>• Building secure base organizations</li>
                    <li>• Navigating change and complexity</li>
                    <li>• Scaling leadership effectiveness</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
