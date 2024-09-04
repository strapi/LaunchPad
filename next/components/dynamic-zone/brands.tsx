"use client";
import { useEffect, useState } from "react";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export const Brands = ({ heading, sub_heading, logos }: { heading: string, sub_heading: string, logos: any[] }) => {
  const middleIndex = Math.floor(logos.length / 2);
  const firstHalf = logos.slice(0, middleIndex);
  const secondHalf = logos.slice(middleIndex);
  const logosArraySplitInHalf = [firstHalf, secondHalf];

  let [stateLogos, setLogos] = useState(logosArraySplitInHalf);
  const [activeLogoSet, setActiveLogoSet] = useState(stateLogos[0]);
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
      <Heading className="pt-4">{heading}</Heading>
      <Subheading className="max-w-3xl mx-auto">
        {sub_heading}
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
                src={`http://localhost:1337${logo.image.url}`}
                alt={logo.image.alternativeText}
                width="100"
                height="100"
                className="md:h-20 md:w-40 h-10 w-20 object-contain filter"
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
