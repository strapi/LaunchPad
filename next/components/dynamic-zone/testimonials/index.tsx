import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as ImageType } from '@/types/types';

export interface Testimonial {
  client_name: string;
  client_post: string;
  description: string;
  profile_image: ImageType;
  background: ImageType;
}

export interface TestimonialProps {
  heading: string;
  sub_heading: string;
  testimonials: Testimonial[];
}

export const Testimonials = ({
  heading,
  sub_heading,
  testimonials,
}: TestimonialProps) => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 text-foreground">
      <div className="text-center mb-8">
        <Typography
          as="h2"
          className="text-2xl md:text-3xl font-bold text-primary mb-2"
        >
          {heading}
        </Typography>
        <Typography as="p" className="text-lg md:text-xl">
          {sub_heading}
        </Typography>
      </div>

      <div className='max-w-7xl flex justify-center items-center'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {testimonials.map((el, index) => (
          <div
            key={index}
            className="shadow-md overflow-hidden flex flex-col h-full"
          >
            <div
              className="relative h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(${strapiImage(el.background.url)})`,
              }}
            >
              <div className="absolute inset-0 flex items-end p-4">
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl">
                  <Image
                    src={strapiImage(el.profile_image.url)}
                    alt={el.client_name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <Typography
                      as="h3"
                      className="not-first:mt-0 font-bold text-sm md:text-base text-white"
                    >
                      {el.client_name}
                    </Typography>
                    <Typography
                      as="p"
                      className="not-first:mt-0 text-xs md:text-sm text-white m-0"
                    >
                      {el.client_post}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-start gap-3 mb-4">
                <Image
                  src={strapiImage(el.profile_image.url)}
                  alt={el.client_name}
                  width={40}
                  height={40}
                  className="rounded-full mt-1"
                />
                <div>
                  <Typography
                    as="h4"
                    className="font-bold text-sm md:text-base"
                  >
                    {el.client_name}
                  </Typography>
                  <Typography as="p" className="not-first:mt-0 text-xs md:text-sm mb-2">
                    {el.client_post}
                  </Typography>
                </div>
              </div>
              <Typography
                as="p"
                className="not-first:mt-0 text-sm md:text-base leading-relaxed"
              >
                {el.description}
              </Typography>

              <Button className="bg-primary text-background w-37 text-white">
                Parler à un expert
              </Button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};
