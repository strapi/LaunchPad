'use client';

import { IconCheck, IconPlus, IconReceipt2 } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { cn } from '@/lib/utils';

type Perks = {
  [key: string]: string;
};

type CTA = {
  [key: string]: string;
};

type Plan = {
  name: string;
  price: number;
  perks: Perks[];
  additional_perks: Perks[];
  description: string;
  number: string;
  featured?: boolean;
  CTA?: CTA | undefined;
  localizations?: Plan[];
  locale?: string;
};

// Helper to ensure the plan object has the correct shape if needed
const normalizePlan = (plan: any): Plan => {
  return plan as Plan;
};

const translations = {
  en: {
    currency: '$',
    featured: 'Featured',
  },
  fr: {
    currency: '€',
    featured: 'En vedette',
  },
};

export const Pricing = ({
  heading,
  sub_heading,
  plans,
  locale = 'en',
}: {
  heading: string;
  sub_heading: string;
  plans: any[];
  locale?: string;
}) => {
  const onClick = (plan: Plan) => {
    console.log('click', plan);
  };
  return (
    <div className="pt-40">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <Card
              onClick={onClick}
              key={plan.name}
              plan={plan}
              locale={locale}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({
  plan,
  onClick,
  locale,
}: {
  plan: Plan;
  onClick: (plan: Plan) => void;
  locale: string;
}) => {
  const t = translations[locale as keyof typeof translations] || translations.en;

  // Try to find the plan content that matches the current locale
  // This handles cases where the page links to the English plan but a French version exists
  let displayPlan = plan;
  if (plan.localizations && plan.localizations.length > 0) {
    const localizedPlan = plan.localizations.find((p) => p.locale === locale);
    if (localizedPlan) {
      displayPlan = normalizePlan(localizedPlan); // helper to ensure shape matches if needed, but assuming same shape
    }
  }

  // Ensure perks are also localized if the plan didn't switch or if structure is different
  // Assuming localizedPlan has its own perks.

  return (
    <div
      className={cn(
        'p-4 md:p-4 rounded-3xl bg-neutral-900 border-2 border-neutral-800',
        displayPlan.featured && 'border-neutral-50 bg-neutral-100'
      )}
    >
      <div
        className={cn(
          'p-4 bg-neutral-800 rounded-2xl shadow-[0px_-1px_0px_0px_var(--neutral-700)]',
          displayPlan.featured && 'bg-white shadow-aceternity'
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn('font-medium', displayPlan.featured && 'text-black')}>
            {displayPlan.name}
          </p>
          {displayPlan.featured && (
            <div
              className={cn(
                'font-medium text-xs px-3 py-1 rounded-full relative bg-neutral-900'
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
              {t.featured}
            </div>
          )}
        </div>
        <div className="mt-8 flex items-baseline">
          {displayPlan.price && (
            <span
              className={cn(
                'text-lg font-bold text-neutral-500',
                displayPlan.featured && 'text-neutral-700'
              )}
            >
              {t.currency}
            </span>
          )}
          <span
            className={cn('text-4xl font-bold', displayPlan.featured && 'text-black')}
          >
            {displayPlan.price || displayPlan?.CTA?.text}
          </span>
          {displayPlan.price && (
            <span
              className={cn(
                'text-lg font-normal text-neutral-500 ml-2',
                displayPlan.featured && 'text-neutral-700'
              )}
            >
              launch
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className={cn(
            'w-full mt-10 mb-4',
            displayPlan.featured &&
            'bg-black text-white hover:bg-black/80 hover:text-white'
          )}
          onClick={() => onClick(displayPlan)}
        >
          {displayPlan?.CTA?.text}
        </Button>
      </div>
      <div className="mt-1 p-4">
        {displayPlan.perks.map((feature, idx) => (
          <Step featured={displayPlan.featured} key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
      {displayPlan.additional_perks && displayPlan.additional_perks.length > 0 && (
        <Divider featured={displayPlan.featured} />
      )}
      <div className="p-4">
        {displayPlan.additional_perks?.map((feature, idx) => (
          <Step featured={displayPlan.featured} additional key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
    </div>
  );
};


const Step = ({
  children,
  additional,
  featured,
}: {
  children: React.ReactNode;
  additional?: boolean;
  featured?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          'h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5',
          additional ? 'bg-indigo-600' : 'bg-neutral-700'
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div
        className={cn(
          'font-medium text-white text-sm',
          featured && 'text-black'
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn('w-full h-px bg-neutral-950', featured && 'bg-white')}
      />
      <div
        className={cn(
          'w-full h-px bg-neutral-800',
          featured && 'bg-neutral-200'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 h-5 w-5 m-auto rounded-xl bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center',
          featured && 'bg-white shadow-aceternity'
        )}
      >
        <IconPlus
          className={cn(
            'h-3 w-3 [stroke-width:4px] text-neutral-300',
            featured && 'text-black'
          )}
        />
      </div>
    </div>
  );
};
