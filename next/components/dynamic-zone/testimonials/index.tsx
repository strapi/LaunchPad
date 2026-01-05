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
  background_color?: string;
}

export const Testimonials = ({
  heading,
  sub_heading,
  testimonials,
  background_color,
}: TestimonialProps) => {
  return (
    <section style={{ backgroundColor: background_color || '#2E5399' }} className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 text-foreground">
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 text-center mb-6 sm:mb-8 md:mb-10 max-w-4xl">
        <Typography
          variant="h2"
          className={`${background_color ? "text-primary" : "text-white"} mb-1 sm:mb-2 px-2`}
        >
          {heading}
        </Typography>
        <Typography
          variant="p"
          className={`${background_color ? "text-black" : "text-white"} px-4 sm:px-8 md:px-12 lg:px-16`}
        >
          {sub_heading}
        </Typography>
      </div>

      <div className="w-full max-w-7xl flex justify-center items-center px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
          {testimonials.map((el, index) => (
            <div
              key={index}
              className="shadow-md overflow-hidden flex flex-col h-full bg-background w-full max-w-full sm:max-w-[592px] mx-auto"
            >
              <div
                className="relative h-36 sm:h-40 md:h-48 lg:h-52 bg-cover bg-center m-2 sm:m-3"
                style={{
                  backgroundImage: `url(${strapiImage(el.background.url)})`,
                }}
              >
                <div className="absolute inset-0 flex items-end p-2 sm:p-3 md:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-black/40 rounded-lg sm:rounded-xl w-full sm:w-auto">
                    <Image
                      src={strapiImage(el.profile_image.url)}
                      alt={el.client_name}
                      width={40}
                      height={40}
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="base"
                        className="not-first:mt-0 font-bold text-xs sm:text-sm md:text-base text-white truncate"
                      >
                        {el.client_name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="not-first:mt-0 text-white m-0 text-[10px] sm:text-xs truncate"
                      >
                        {el.client_post}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5 flex bg-white flex-col flex-grow gap-2 sm:gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Image
                    src={strapiImage(el.profile_image.url)}
                    alt={el.client_name}
                    width={40}
                    height={40}
                    className="rounded-full mt-1 w-8 h-8 sm:w-10 sm:h-10 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="base"
                      className="font-bold text-sm sm:text-base truncate"
                    >
                      {el.client_name}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="not-first:mt-0 mb-1 sm:mb-2 font-bold text-foreground text-xs sm:text-sm truncate"
                    >
                      {el.client_post}
                    </Typography>
                  </div>
                </div>
                <Typography
                  variant="base"
                  className="not-first:mt-0 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed line-clamp-4 sm:line-clamp-5 md:line-clamp-none"
                >
                  {el.description}
                </Typography>

                <Button className="bg-primary text-white mt-auto text-xs sm:text-sm md:text-base py-2 sm:py-3 sm:px-6 w-1/2">
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