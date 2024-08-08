"use client";
import React, { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import StarBackground from "@/components/decorations/star-background";
import ShootingStars from "@/components/decorations/shooting-star";
import { AnimatePresence, motion } from "framer-motion";
import { IconContainer } from "../icon-container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MetaIcon,
  SlackIcon,
  TiktokIcon,
  TwitterIcon,
} from "@/components/icons/illustrations";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

var loopInterval: NodeJS.Timeout;
export const SkeletonFour = () => {
  const icons = [
    {
      title: "Twitter",
      icon: TwitterIcon,
      className: "left-2 top-2",
    },
    {
      title: "Meta2",
      icon: MetaIcon,
      className: "left-32 top-32",
    },
    {
      title: "Instagram",
      icon: InstagramIcon,
      className: "left-1/2 top-1/2",
    },
    {
      title: "LinkedIn2",
      icon: LinkedInIcon,
      className: "left-1/2 top-20",
    },
    {
      title: "Facebook",
      icon: FacebookIcon,
      className: "right-20 top-20",
    },
    {
      title: "Slack2",
      icon: SlackIcon,
      className: "right-20 bottom-0",
    },
    {
      title: "Tiktok",
      icon: TiktokIcon,
      className: "left-52 bottom-10",
    },
    {
      title: "Meta",
      icon: MetaIcon,
      className: "left-32 bottom-60",
    },
    {
      title: "Twitter2",
      icon: TwitterIcon,
      className: "right-96 top-24",
    },
    {
      title: "Instagram2",
      icon: InstagramIcon,
      className: "left-10 bottom-0",
    },
    {
      title: "LinkedIn",
      icon: LinkedInIcon,
      className: "right-40 top-0",
    },
    {
      title: "Facebook2",
      icon: FacebookIcon,
      className: "right-40 top-40",
    },
    {
      title: "Slack",
      icon: SlackIcon,
      className: "right-0 bottom-60",
    },
    {
      title: "Tiktok2",
      icon: TiktokIcon,
      className: "right-10 bottom-80",
    },
  ];

  const [active, setActive] = useState(icons[0]);

  useEffect(() => {
    loopInterval = setInterval(() => {
      setActive(icons[Math.floor(Math.random() * icons.length)]);
    }, 3000);
    return () => clearInterval(loopInterval);
  }, []);

  return (
    <div className="p-8 overflow-hidden h-full relative flex flex-col group [perspective:8000px] [transform-style:preserve-3d]">
      <StarBackground />
      <ShootingStars />

      {icons.map((icon) => (
        <IconContainer
          className={cn(
            "rounded-full opacity-20 mx-2 absolute",
            icon.className,
            active.title === icon.title && "opacity-100"
          )}
          key={icon.title}
        >
          {<icon.icon />}
          {active.title === icon.title && (
            <motion.div
              layoutId="bubble"
              className="absolute h-16 w-16 inset-0 rounded-full border-2  -ml-0.5 -mt-0.5 border-indigo-500"
            ></motion.div>
          )}
        </IconContainer>
      ))}
    </div>
  );
};

{
  /* <svg
  width="123"
  height="146"
  viewBox="0 0 123 146"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M1 145.5V106.506C1 102.335 2.62918 98.3279 5.54033 95.3402L53.4597 46.1598C56.3708 43.1721 58 39.1655 58 34.994V17.5C58 8.66344 65.1634 1.5 74 1.5H122.5"
    stroke="#F8F8F8"
    stroke-width="1.5"
  />
</svg>; */
}
