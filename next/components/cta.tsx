"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./elements/button";
import { HiArrowRight } from "react-icons/hi2";
import { AmbientColor } from "./decorations/ambient-color";
import { Container } from "./container";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations('CTA');
  return (
    <div className="relative py-40">
      <AmbientColor />
      <Container className="flex flex-col md:flex-row justify-between items-center w-full px-8">
        <div className="flex flex-col">
          <motion.h2 className="text-white text-xl text-center md:text-left md:text-3xl font-bold mx-auto md:mx-0 max-w-xl ">
            {t("title")}
          </motion.h2>
          <p className="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-neutral-400">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button as={Link} href="/contact" variant="simple" className="py-3">
            {t("button")}
          </Button>
          <Button className="flex space-x-2 items-center group !text-lg">
            <span>{t("signup-now")}</span>
            <HiArrowRight className="text-black group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </Container>
    </div>
  );
};
