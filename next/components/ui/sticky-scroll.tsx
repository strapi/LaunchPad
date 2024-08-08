"use client";
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}) => {
  return (
    <div className="py-4 md:py-20">
      <motion.div className="hidden lg:flex h-full  flex-col max-w-7xl mx-auto justify-between relative   p-10 ">
        {content.map((item, index) => (
          <ScrollContent key={item.title + index} item={item} index={index} />
        ))}
      </motion.div>
      <motion.div className="flex lg:hidden  flex-col max-w-7xl mx-auto justify-between relative  p-10 ">
        {content.map((item, index) => (
          <ScrollContentMobile
            key={item.title + index}
            item={item}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const ScrollContent = ({
  item,
  index,
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const translate = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const translateContent = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.5, 0.7, 1],
    [0, 1, 1, 0, 0]
  );

  const opacityContent = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      transition={{
        duration: 0.3,
      }}
      key={item.title + index}
      className="my-40  relative grid grid-cols-2 gap-8"
    >
      <motion.div
        key={item.title + index}
        style={{
          y: translate,
          opacity: opacity,
        }}
        className="h-full w-full rounded-md  self-start "
      >
        {item.content && item.content}
      </motion.div>
      <div className="w-full ">
        <motion.div
          style={{
            y: translateContent,
            opacity: index === 0 ? opacityContent : 1,
          }}
          className=""
        >
          <div>{item.icon}</div>
          <motion.h2 className="max-w-md mt-2 font-bold text-2xl lg:text-4xl inline-block bg-clip-text text-left text-transparent bg-gradient-to-b from-white  to-white">
            {item.title}
          </motion.h2>

          <motion.p className="text-lg text-neutral-500 font-regular max-w-sm mt-2">
            {item.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const ScrollContentMobile = ({
  item,
  index,
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  return (
    <motion.div
      transition={{
        duration: 0.3,
      }}
      key={item.title + index}
      className="my-10  relative flex flex-col md:flex-row md:space-x-4"
    >
      <motion.div
        key={item.title + index}
        className="w-full rounded-md  self-start mb-8"
      >
        {item.content && item.content}
      </motion.div>
      <div className="w-full">
        <motion.div className=" mb-6">
          <div>{item.icon}</div>
          <motion.h2 className="mt-2 font-bold text-2xl lg:text-4xl inline-block bg-clip-text text-left text-transparent bg-gradient-to-b from-white  to-white">
            {item.title}
          </motion.h2>

          <motion.p className="text-sm md:text-base text-neutral-500 font-bold max-w-sm mt-2">
            {item.description}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};
