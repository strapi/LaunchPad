"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const SkeletonFive = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-start justify-center">
      <div className="flex absolute inset-0 flex-col group-hover:-translate-y-80 transition duration-200 items-center justify-center">
        <Container>
          <Image
            src="/avatar.png"
            className="h-16 w-16 rounded-md object-cover"
            alt="avatar"
            width="100"
            height="100"
          />
        </Container>
        <p className="mt-4 text-sm text-neutral-400 font-bold">Manu Arora</p>
        <div className="flex items-center gap-2 text-xs mt-4">
          <p>Most engagements</p>
          <div className="h-1 w-1 rounded-full bg-neutral-400" />
          <p>69,420</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="336"
          height="126"
          viewBox="0 0 336 126"
          fill="none"
        >
          <path
            d="M0 1C9.88235 1 9.88235 64.1698 19.7647 64.1698C29.6471 64.1698 29.6471 108.623 39.5294 108.623C49.4118 108.623 49.4118 125 59.2941 125C69.1765 125 69.1765 50.1321 79.0588 50.1321C88.9412 50.1321 88.9412 94.5849 98.8235 94.5849C108.706 94.5849 108.706 73.5283 118.588 73.5283C128.471 73.5283 128.471 85.2264 138.353 85.2264C148.235 85.2264 148.235 61.8302 158.118 61.8302C168 61.8302 168 57.1509 177.882 57.1509C187.765 57.1509 187.765 52.4717 197.647 52.4717C207.529 52.4717 207.529 92.2453 217.412 92.2453C227.294 92.2453 227.294 96.9245 237.176 96.9245C247.059 96.9245 247.059 113.302 256.941 113.302C266.824 113.302 266.824 101.604 276.706 101.604C286.588 101.604 286.588 38.434 296.471 38.434C306.353 38.434 306.353 103.943 316.235 103.943C326.118 103.943 326.118 103.943 336 103.943"
            stroke="#F8F8F8"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="flex absolute inset-0 flex-col translate-y-80 group-hover:translate-y-0 transition duration-200 items-center justify-center">
        <Container>
          <Image
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"
            className="h-16 w-16 rounded-md object-cover"
            alt="avatar"
            width="100"
            height="100"
          />
        </Container>
        <p className="mt-4 text-sm text-neutral-400 font-bold">Tyler Durden</p>
        <div className="flex items-center gap-2 text-xs mt-4">
          <p>Most engagements</p>
          <div className="h-1 w-1 rounded-full bg-neutral-400" />
          <p>8008</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="336"
          height="126"
          viewBox="0 0 336 126"
          fill="none"
        >
          <path
            d="M0 1C9.88235 1 9.88235 64.1698 19.7647 64.1698C29.6471 64.1698 29.6471 108.623 39.5294 108.623C49.4118 108.623 49.4118 125 59.2941 125C69.1765 125 69.1765 50.1321 79.0588 50.1321C88.9412 50.1321 88.9412 94.5849 98.8235 94.5849C108.706 94.5849 108.706 73.5283 118.588 73.5283C128.471 73.5283 128.471 85.2264 138.353 85.2264C148.235 85.2264 148.235 61.8302 158.118 61.8302C168 61.8302 168 57.1509 177.882 57.1509C187.765 57.1509 187.765 52.4717 197.647 52.4717C207.529 52.4717 207.529 92.2453 217.412 92.2453C227.294 92.2453 227.294 96.9245 237.176 96.9245C247.059 96.9245 247.059 113.302 256.941 113.302C266.824 113.302 266.824 101.604 276.706 101.604C286.588 101.604 286.588 38.434 296.471 38.434C306.353 38.434 306.353 103.943 316.235 103.943C326.118 103.943 326.118 103.943 336 103.943"
            stroke="#F8F8F8"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-20 w-20 rounded-lg flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};
