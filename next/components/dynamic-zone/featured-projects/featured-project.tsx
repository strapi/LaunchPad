import React from "react";
import Link from "next/link";
import { BlurImage } from "@/components/blur-image";
import { FeaturedProjectProps } from "./types";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Button } from "@/components/elements/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const FeaturedProject = ({
  title,
  logo,
  paragraphs,
  CTAs,
  images,
  locale
}: FeaturedProjectProps & {
  locale: string;
}) => {
  return (
    <div className="w-3xl max-w-8xl bg-neutral-100 flex flex-col gap-4 lg:rounded-3xl shadow-lg md:px-20 py-10">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
        {
          title && (
            <h1 className="text-lg md:text-3xl lg:text-4xl text-charcoal font-bold mb-4">{title}</h1>
          )
        }
        {
          logo && (
            <BlurImage
              src={strapiImage(logo?.url)}
              alt="Featured Project Logo"
              width={200}
              height={200}
              className="object-cover"
            />
          )
        }
      </div>

      <div className="flex flex-col lg:flex-row gap-16 mb-8 items-center justify-between">
        <div className="w-full lg:w-1/2">
          {images && images.length > 1 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index} className="flex items-center justify-center">
                    <BlurImage
                      src={strapiImage(image.url)}
                      alt="Project Image"
                      width={400}
                      height={400}
                      className="rounded-3xl object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            images[0] && (
              <BlurImage
                key={images[0].url}
                src={strapiImage(images[0].url)}
                alt="Project Image"
                width={400}
                height={200}
                className="w-full md:rounded-3xl object-cover"
              />
            )
          )}
        </div>

        {/* Paragraphs */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="flex flex-col gap-4 text-center px-5">
          {
            paragraphs && paragraphs.map(({ title, text }) => {
              // @TODO: Use markdown parser with custom react components for translation
              const chunks = text?.split(/(\r\n|\n|\r)/gm).filter((chunk) => chunk.trim() !== "") || [];
              return (
                <>
                  {
                    title && <h1 className="text-4xl text-charcoal font-bold mb-8">{title}</h1>
                  }
                  {
                    chunks.map((chunk, index) => (
                      <p key={index} className="text-base md:text-lg text-charcoal mb-4">
                        {chunk}
                      </p>
                    ))
                  }
                </>
              )
            })
          }
          </div>
          <div className="flex flex-row gap-2 mt-4 justify-center">
            {CTAs.map((cta) => (
              <Button
                className="md:py-2 md:px-4 md:text-lg lg:py-5 lg:px-10 lg:text-3xl"
                key={cta?.URL}
                as={Link}
                href={`/${locale}${cta.URL}`}
                {...(cta.variant && { variant: cta.variant })}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};