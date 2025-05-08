"use client";
import Image from "next/image";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { AnimatePresence } from "framer-motion";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Autoscroll from "embla-carousel-auto-scroll";

export const Brands = ({ heading, sub_heading, logos }: { heading: string, sub_heading: string, logos: any[] }) => {
  return (
    <div className="relative z-20 pb-10">
      <Heading className="pt-4">{heading}</Heading>
      <Subheading className="max-w-3xl mx-auto">
        {sub_heading}
      </Subheading>

      <div className="flex gap-10 flex-wrap justify-center md:gap-40 relative h-full w-full mt-20">
        <AnimatePresence
          mode="popLayout"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[Autoscroll({ speed: 2, stopOnInteraction: false })]}
          >
            <CarouselContent>
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.title}
                  className="flex items-center justify-center basis-1/5"
                >
                  <Image
                    src={strapiImage(logo.image.url)}
                    alt={logo.image.alternativeText}
                    width="400"
                    height="400"
                    className="md:h-20 md:w-60 h-10 w-40 object-contain filter"
                    draggable={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </AnimatePresence>
      </div>
    </div>
  );
};
