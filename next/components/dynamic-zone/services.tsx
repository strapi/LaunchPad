import React from 'react';

import { Button } from '../ui/button';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';
import { ArrowUpRight } from 'lucide-react';

type ServiceProps = {
  title: string;
  description: string;
  documentId: string;
  background?: Image;
  slug: string
};

type ServicesProps = {
  heading: string;
  sub_heading: string;
  service: ServiceProps[];
  locale: string
};

export function Services({ heading, sub_heading, service, locale }: ServicesProps) {
  return (
    <section className="h-screen w-full flex flex-col items-center bg-[var(--tertiare)] py-18 px-4 md:px-10 gap-8">
      <h2 className="text-primary text-3xl md:text-5xl font-bold text-center">
        {heading}
      </h2>

      <p className="text-black text-center text-base md:text-lg max-w-2xl">
        {sub_heading}
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        {service.map((el) => (
          <CardComponent
            key={el.documentId}
            heading={el.title}
            sub_heading={el.description}
            BackgroundImage={el.background}
            slug={el.slug}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function CardComponent({
  heading,
  sub_heading,
  BackgroundImage,
  slug,
  locale
}: {
  heading: string;
  sub_heading: string;
  BackgroundImage?: Image;
  slug: string,
  locale: string
}) {
  function OnNavigatePage() {
    window.location.href = slug;
  }

  return (
    <div className="h-[380px] sm:h-[400px] md:h-[420px] w-full rounded-xl p-6 flex flex-col justify-center items-center bg-cover bg-center relative"
      style={BackgroundImage ? { backgroundImage: `url('${strapiImage(BackgroundImage?.url)}')` } : undefined}
    >
      <ArrowUpRight className='text-primary absolute top-3 right-3' />

      <h3 className="text-lg md:text-xl text-black font-bold text-center">
        {heading}
      </h3>

      <p className="text-sm md:text-base text-black mt-2 text-center mb-12">
        {sub_heading}
      </p>

      <a href={`/${locale}${slug}`}>
        <Button
          onClick={OnNavigatePage}
          className="bg-primary text-white font-semibold mt-4 w-fit px-4 py-2 hover:bg-primary"
        >
          Découvrir le service
        </Button>
      </a>

    </div>
  );
}