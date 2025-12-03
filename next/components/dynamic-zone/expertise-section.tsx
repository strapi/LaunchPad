'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as ImageType } from '@/types/types';

type expertise = {
  title: string;
  description: string;
};

type ExpertiseSectionProps = {
  heading: string;
  sub_heading: string;
  description: string;
  expertise: expertise[];
  background: ImageType;
};

export function ExpertiseSection({
  heading,
  sub_heading,
  description,
  expertise,
  background,
}: ExpertiseSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-20 text-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start px-6">
        <div className="relative w-full h-[400px] md:h-[550px] rounded-xl overflow-hidden">
          {background?.url && (
            <Image
              src={strapiImage(background.url)}
              alt="expertise image"
              fill
              className="object-cover rounded-xl"
            />
          )}
        </div>

        <div>
          <Typography
            variant="h2"
            className="font-bold text-primary text-3xl md:text-4xl mb-4"
          >
            {heading}
          </Typography>

          <Typography variant="p" className="text-lg mb-4">
            {sub_heading}
          </Typography>

          <Typography variant="p" className="text-base mb-10 leading-relaxed">
            {description}
          </Typography>

          <div className="space-y-4">
            {expertise.map((item, i) => (
              <ExpertiseOption
                key={i}
                title={item.title}
                description={item.description}
                index={i}
                open={i === openIndex}
                onToggle={() => setOpenIndex(i === openIndex ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseOption({
  title,
  description,
  index,
  open,
  onToggle,
}: expertise & { index: number; open: boolean; onToggle: () => void }) {
  return (
    <div id="expertise-items" className="border-b pb-3 cursor-pointer">
      <div onClick={onToggle} className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-500 text-lg">
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <p className="mt-3 leading-relaxed pr-6">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
