import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";
import { BlurImage } from "./blur-image";

export const Logo = ({ image }: { image: any }) => {
  if (image) {
    return (
      <Link
        href="/"
        className="font-normal flex space-x-2 items-center text-sm mr-4  text-black   relative z-20"
      >
        <BlurImage
          src={`http://localhost:1337${image?.url}`}
          alt="LaunchPad"
          width={200}
          height={200}
          className="h-10 w-10 rounded-xl mr-2"
        />

        <span className="text-white font-bold">LaunchPad</span>
      </Link>
    );
  }

  return;

};
