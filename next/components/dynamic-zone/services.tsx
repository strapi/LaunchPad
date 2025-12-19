import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Image } from '@/types/types';
import { Typography } from '../ui/typography';

type ServiceProps = {
  title: string;
  description: string;
  documentId: string;
  background?: Image;
  slug: string;
};

type ServicesProps = {
  heading: string;
  sub_heading: string;
  service: ServiceProps[];
  locale: string;
};

export function Services({
  heading,
  sub_heading,
  service,
  locale,
}: ServicesProps) {
  const cardStyles = [
    { bg: 'bg-red-100', text: 'text-black' },
    { bg: 'bg-blue-600', text: 'text-white' },
    { bg: 'bg-blue-200', text: 'text-black' },
  ];

  return (
    <section className="w-full flex flex-col items-center bg-tertiare py-8 sm:py-12 md:py-16 lg:py-18 px-4 sm:px-6 md:px-8 lg:px-10 gap-6 sm:gap-8 md:gap-10">
      {/* Heading avec responsive amélioré */}
      <Typography
        variant={'h2'}
        className="text-primary font-bold text-center px-2"
      >
        {heading}
      </Typography>

      {/* Sub-heading avec responsive amélioré */}
      <Typography
        variant={'p'}
        className="text-black text-center max-w-xl lg:max-w-2xl px-4"
      >
        {sub_heading}
      </Typography>

      {/* Grid responsive avec breakpoints optimisés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-7xl">
        {service.map((el, index) => {
          const style = cardStyles[index % cardStyles.length];

          return (
            <CardComponent
              key={el.documentId}
              heading={el.title}
              sub_heading={el.description}
              slug={el.slug}
              locale={locale}
              bgColor={style.bg}
              textColor={style.text}
            />
          );
        })}
      </div>
    </section>
  );
}

function CardComponent({
  heading,
  sub_heading,
  slug,
  locale,
  bgColor,
  textColor,
}: {
  heading: string;
  sub_heading: string;
  slug: string;
  locale: string;
  bgColor: string;
  textColor: string;
}) {
  function OnNavigatePage() {
    window.location.href = slug;
  }

  return (
    <div
      className={cn(
        // Hauteurs responsives optimisées
        'h-[320px] xs:h-[350px] sm:h-[380px] md:h-[420px] lg:h-[460px] xl:min-h-[480px]',
        'max-h-[609px] w-full max-w-[497px]',
        // Padding responsive
        'rounded-lg sm:rounded-xl',
        'p-4 sm:p-5 md:p-6',
        // Flexbox
        'flex flex-col justify-between items-center',
        'bg-cover bg-center relative',
        // Transition pour hover
        'transition-transform duration-300 hover:scale-[1.02]',
        bgColor
      )}
    >
      {/* Icône responsive */}
      <ArrowUpRight className="text-primary absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6" />

      {/* Contenu centré avec espacement flexible */}
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <Typography
          variant="h3"
          className={cn(
            'font-bold text-center mb-3 sm:mb-4 md:mb-6 px-2',
            textColor
          )}
        >
          {heading}
        </Typography>

        <Typography
          variant="base"
          className={cn(
            'text-center px-2 sm:px-4 line-clamp-4 sm:line-clamp-none',
            textColor
          )}
        >
          {sub_heading}
        </Typography>
      </div>

      {/* Bouton avec responsive */}
      <a href={`/${locale}${slug}`} className="w-full sm:w-auto">
        <Button
          onClick={OnNavigatePage}
          className={cn(
            'bg-primary text-white font-semibold',
            'w-full sm:w-auto',
            'px-4 sm:px-6 md:px-5',
            'py-2 sm:py-2.5 md:py-6',
            'text-sm sm:text-base',
            'hover:bg-primary/90',
            'transition-colors duration-100'
          )}
        >
          Découvrir le service
        </Button>
      </a>
    </div>
  );
}