"use client";

import { useState, useRef, useEffect, memo } from "react";import { Transition } from "@headlessui/react";
import { SparklesCore } from "../../ui/sparkles";
import { cn } from "@/lib/utils";
import { StrapiImage } from "@/components/ui/strapi-image"

export const TestimonialsSlider = ({ testimonials }: { testimonials: any }) => {
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(true);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const slicedTestimonials = testimonials.slice(0, 3);

  useEffect(() => {
    if (!autorotate) return;
    const interval = setInterval(() => {
      setActive(
        active + 1 === slicedTestimonials.length ? 0 : (active) => active + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [active, autorotate, slicedTestimonials.length]);

  const heightFix = () => {
    if (testimonialsRef.current && testimonialsRef.current.parentElement)
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        heightFix();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section>
      <div className="max-w-3xl mx-auto  relative z-30 h-80">
        <div className="relative pb-12 md:pb-20">
          {/* Particles animation */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 -z-10 w-80 h-20 -mt-6">
            <MemoizedSparklesCore
              id="new-particles"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>

          {/* Carousel */}
          <div className="text-center">
            {/* Testimonial image */}
            <div className="relative h-40 [mask-image:_linear-gradient(0deg,transparent,#FFFFFF_30%,#FFFFFF)] md:[mask-image:_linear-gradient(0deg,transparent,#FFFFFF_40%,#FFFFFF)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] -z-10 pointer-events-none before:rounded-full rounded-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-neutral-400/20 before:to-transparent before:to-20% after:rounded-full after:absolute after:inset-0 after:bg-neutral-900 after:m-px before:-z-20 after:-z-20">
                {slicedTestimonials.map((item: any, index: number) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-&lsqb;cubic-bezier(0.68,-0.3,0.32,1)&rsqb; duration-700 order-first"
                    enterFrom="opacity-0 -translate-x-20"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-&lsqb;cubic-bezier(0.68,-0.3,0.32,1)&rsqb; duration-700"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-20"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="absolute inset-0 h-full -z-10">
                      <StrapiImage 
                        className="relative top-11 left-1/2 -translate-x-1/2 rounded-full"
                        src={item.user.image.url}
                        width={56}
                        height={56}
                        alt={`${item.user.firstname} ${item.user.lastname}`}
                      />
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Text */}
            <div className="mb-10 transition-all duration-150 delay-300 ease-in-out px-8 sm:px-6">
              <div className="relative flex flex-col" ref={testimonialsRef}>
                {slicedTestimonials.map((item: any, index: number) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-in-out duration-500 delay-200 order-first"
                    enterFrom="opacity-0 -translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-out duration-300 delay-300 absolute"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="text-base md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200/60 via-neutral-200 to-neutral-200/60">
                      {item.text}
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap justify-center -m-1.5 px-8 sm:px-6">
              {slicedTestimonials.map((item: any, index: number) => (
                <button
                  className={cn(
                    `px-2 py-1 rounded-full m-1.5 text-xs border border-transparent text-neutral-300 transition duration-150 ease-in-out [background:linear-gradient(theme(colors.neutral.900),_theme(colors.neutral.900))_padding-box,_conic-gradient(theme(colors.neutral.400),_theme(colors.neutral.700)_25%,_theme(colors.neutral.700)_75%,_theme(colors.neutral.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-neutral-800/30 before:rounded-full before:pointer-events-none ${active === index
                      ? "border-secondary/50"
                      : "border-transparent opacity-70"
                    }`
                  )}
                  key={index}
                  onClick={() => {
                    setActive(index);
                    setAutorotate(false);
                  }}
                >
                  <span className="relative">
                    <span className="text-neutral-50 font-bold">
                      {item.user.firstname + item.user.lastname}
                    </span>{" "}
                    <br className="block sm:hidden" />
                    <span className="text-neutral-600 hidden sm:inline-block">
                      -
                    </span>{" "}
                    <span className="hidden sm:inline-block">
                      {item.user.job}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedSparklesCore = memo(SparklesCore);
