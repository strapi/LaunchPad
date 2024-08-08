"use client";
import { motion, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState } from "react";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "./elements/heading";
import { Subheading } from "./elements/subheading";
import { StickyScroll } from "@/components/ui/sticky-scroll";
import {
  IconMailForward,
  IconRocket,
  IconSocial,
  IconTerminal,
  IconTool,
} from "@tabler/icons-react";
import { useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const englishContent = [
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Successfully delivered blog posts to WebOrbit",
    description:
      "Our cutting-edge content delivery system successfully launched and distributed blog posts to WebOrbit, ensuring seamless global access and optimal performance.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #102
      </p>
    ),
  },
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Launched product updates for SpaceTech",
    description:
      "We were able to launch product updates for SpaceTech, ensuring they were delivered to their customers in a timely manner.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #101
      </p>
    ),
  },
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Sent marketing content to AstroContent.",
    description:
      "AstroContent is by far the fastest growing content delivery platform, we were able to send marketing content to them.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #100
      </p>
    ),
  },
];

const frenchContent = [
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Livraison réussie des articles de blog à WebOrbit",
    description:
      "Notre système de livraison de contenu de pointe a réussi à lancer et à distribuer des articles de blog à WebOrbit, assurant un accès mondial sans faille et des performances optimales.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #102
      </p>
    ),
  },
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Lancement des mises à jour de produits pour SpaceTech",
    description:
      "Nous avons réussi à lancer des mises à jour de produits pour SpaceTech, en veillant à ce qu'elles soient livrées à leurs clients en temps opportun.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #101
      </p>
    ),
  },
  {
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    title: "Envoi de contenu marketing à AstroContent",
    description:
      "AstroContent est de loin la plateforme de livraison de contenu à la croissance la plus rapide, nous avons pu leur envoyer du contenu marketing.",
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        Mission #100
      </p>
    ),
  },
]

export const Launches = () => {
  const t = useTranslations('Launches');
  const locale = useLocale();
  const content = locale === "en" ? englishContent : frenchContent;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgrounds = ["var(--charcoal)", "var(--zinc-900)", "var(--charcoal)"];

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / content.length);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });
  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
    >
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="mt-4">{t("title")}</Heading>
        <Subheading>
          {t("subtitle")}
        </Subheading>
      </div>
      <StickyScroll content={content} />
    </motion.div>
  );
};
