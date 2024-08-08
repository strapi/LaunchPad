"use client";
import { useEffect, useState } from "react";
import { Heading } from "./elements/heading";
import { Subheading } from "./elements/subheading";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { IconTrademark } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const Brands = () => {
  const t = useTranslations('Brands');
  let [logos, setLogos] = useState([
    [
      {
        title: "netflix",
        src: "/logos/netflix.png",
      },
      {
        title: "google",
        src: "/logos/google.webp",
      },
      {
        title: "meta",
        src: "/logos/meta.png",
      },
      {
        title: "tesla",
        src: "/logos/tesla.png",
      },
    ],
    [
      {
        title: "spacex second",
        src: "/logos/spacex.png",
        className: "filter invert",
      },
      {
        title: "tesla second",
        src: "/logos/tesla.png",
      },
      {
        title: "netflix second",
        src: "/logos/netflix.png",
      },
      {
        title: "google second",
        src: "/logos/google.webp",
      },
    ],
  ]);
  const [activeLogoSet, setActiveLogoSet] = useState(logos[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const flipLogos = () => {
    setLogos((currentLogos) => {
      const newLogos = [...currentLogos.slice(1), currentLogos[0]];
      setActiveLogoSet(newLogos[0]);
      setIsAnimating(true);
      return newLogos;
    });
  };

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        flipLogos();
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts or isAnimating changes
    }
  }, [isAnimating]);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading className="pt-4">{t('title')}</Heading>
      <Subheading className="max-w-3xl mx-auto">
        {t('subtitle')}
      </Subheading>

      <div className="flex gap-10 flex-wrap justify-center md:gap-40 relative h-full w-full mt-20">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          {activeLogoSet.map((logo, idx) => (
            <motion.div
              initial={{
                y: 40,
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: -40,
                opacity: 0,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.1 * idx,
                ease: [0.4, 0, 0.2, 1],
              }}
              key={logo.title}
              className="relative"
            >
              <Image
                src={logo.src}
                alt={logo.title}
                width="100"
                height="100"
                className={cn(
                  "md:h-20 md:w-40 h-10 w-20 object-contain filter",
                  logo.className
                )}
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
