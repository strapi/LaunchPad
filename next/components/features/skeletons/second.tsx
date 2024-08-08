"use client";
import React, { useCallback, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export const SkeletonTwo = () => {
  const [sliderXPercent, setSliderXPercent] = useState(50);

  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;

      const percent = (x / rect.width) * 100;
      setSliderXPercent(Math.max(0, Math.min(100, percent)));
    },

    []
  );

  return (
    <div
      className="p-8 overflow-hidden relative h-full w-full"
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSliderXPercent(50)}
    >
      <div className="absolute right-0 w-10 h-full bg-gradient-to-r from-transparent to-[#121314] z-40"></div>
      <div
        className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[10%] to-[90%] via-cyan-500 to-transparent"
        style={{
          left: `${sliderXPercent}%`,
          top: "0",
        }}
      >
        <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50" />
        <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100 blur-lg" />
        <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
          <MemoizedSparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
      <BackgroundLines />
      <div
        style={{
          clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
        }}
        className="absolute inset-0 flex flex-col group p-8 z-40"
      >
        <Container className="mt-10 ml-4">
          <Cover>2,052</Cover>
          satellite
        </Container>
        <Container className="mt-4 ml-10 group-hover:border-secondary transition duration-200 group-hover:scale-[1.02]">
          <Cover>8,230,002</Cover>
          Starlinks
        </Container>
        <Container className="mt-4 ml-4">
          <Cover>7,224</Cover>
          rockets
        </Container>
        <Cursor
          className="top-40 left-0 group-hover:left-40 group-hover:top-20"
          textClassName="group-hover:text-secondary"
        />
      </div>
      <div className="absolute inset-0 flex flex-col group p-8 ml-20">
        <Container
          style={{
            opacity: 1 - sliderXPercent * 0.015,
          }}
          className="mt-10 ml-4"
        >
          1 satellite
        </Container>
        <Container
          style={{
            opacity: 1 - sliderXPercent * 0.015,
          }}
          className="mt-4 ml-10 group-hover:border-secondary transition duration-200 "
        >
          7 satellites
        </Container>
        <Container
          style={{
            opacity: 1 - sliderXPercent * 0.015,
          }}
          className="mt-4 ml-4"
        >
          4 rockets
        </Container>

        <Cursor
          className="top-60 left-12 group-hover:left-32 group-hover:top-44"
          textClassName="group-hover:text-white"
          text="Tyler Durden"
          style={{
            opacity: 1 - sliderXPercent * 0.015,
          }}
        />
      </div>
    </div>
  );
};

const Cover = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "border rounded-md px-1 py-0.5 mr-1 border-indigo-500 bg-indigo-500/10 text-white",
        className
      )}
    >
      {children}
    </span>
  );
};

const BackgroundLines = () => {
  return (
    <div className="absolute inset-0 h-full w-full flex flex-row gap-4 justify-center flex-shrink-0 ">
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
      <CircleWithLine />
    </div>
  );
};

const Cursor = ({
  className,
  textClassName,
  text,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  textClassName?: string;
  text?: string;
}) => {
  return (
    <div
      className={cn("absolute h-4 w-4  transition-all duration-200", className)}
      {...props}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-4 w-4  transition duration-200", className)}
      >
        <path
          d="M3.08365 1.18326C2.89589 1.11581 2.70538 1.04739 2.54453 1.00558C2.39192 0.965918 2.09732 0.900171 1.78145 1.00956C1.41932 1.13497 1.13472 1.41956 1.00932 1.78169C0.899927 2.09756 0.965674 2.39216 1.00533 2.54477C1.04714 2.70562 1.11557 2.89613 1.18301 3.0839L5.9571 16.3833C6.04091 16.6168 6.12128 16.8408 6.2006 17.0133C6.26761 17.1591 6.42 17.4781 6.75133 17.6584C7.11364 17.8555 7.54987 17.8612 7.91722 17.6737C8.25317 17.5021 8.41388 17.1873 8.48469 17.0433C8.56852 16.8729 8.65474 16.6511 8.74464 16.4198L10.8936 10.8939L16.4196 8.74489C16.6509 8.655 16.8726 8.56879 17.043 8.48498C17.187 8.41416 17.5018 8.25346 17.6734 7.91751C17.8609 7.55016 17.8552 7.11392 17.6581 6.75162C17.4778 6.42029 17.1589 6.2679 17.0131 6.20089C16.8405 6.12157 16.6165 6.0412 16.383 5.9574L3.08365 1.18326Z"
          fill="var(--blue-900)"
          stroke="var(--blue-500)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className={cn(
          "absolute top-3 left-3 p-1 rounded-md  text-[10px] whitespace-pre text-neutral-500  transition duration-200",
          textClassName
        )}
      >
        {text ?? "Manu Arora"}
      </div>
    </div>
  );
};

const Container = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "p-0.5 rounded-lg border border-neutral-600 w-fit",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-10  text-xs px-2 text-neutral-400  rounded-[5px] flex items-center justify-center bg-neutral-900 shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const CircleWithLine = ({ className }: { className?: string }) => {
  const id = useId();
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(`rounded-full h-3 w-3 border border-[rgba(255,255,255,0.2)] bg-[rgba(248,248,248,0.02)]
      shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]`)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2"
        height="265"
        viewBox="0 0 2 265"
        fill="none"
      >
        <path
          d="M1 265V1"
          stroke={`url(#${id})`}
          strokeOpacity="0.1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={id}
            x1="1.5"
            y1="1"
            x2="1.5"
            y2="265"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F8F8F8" stopOpacity="0.05" />
            <stop offset="0.530519" stopColor="#F8F8F8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#F8F8F8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
