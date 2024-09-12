"use client";
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import StarBackground from "@/components/decorations/star-background";
import ShootingStars from "@/components/decorations/shooting-star";
import { motion } from "framer-motion";
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

var loopInterval: NodeJS.Timeout;
export const SkeletonFour = () => {
  const icons = useMemo(
    () => [
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
    ],
    []
  );

  const [active, setActive] = useState(icons[0]);

  useEffect(() => {
    loopInterval = setInterval(() => {
      setActive(icons[Math.floor(Math.random() * icons.length)]);
    }, 3000);
    return () => clearInterval(loopInterval);
  }, [icons]);

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
