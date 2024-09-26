import { cn } from "@/lib/utils";
import React from "react";
import { LinkProps } from "next/link"; // Or from your routing library

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "simple" | "outline" | "primary" | "muted";
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  href?: LinkProps["href"];
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  as: Tag = "button",
  className,
  children,
  ...props
}) => {
  const variantClass =
    variant === "simple"
      ? "bg-secondary relative z-10 bg-transparent hover:border-secondary/50 hover:bg-secondary/10  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center"
      : variant === "outline"
      ? "bg-white relative z-10 hover:bg-secondary/90 hover:shadow-xl  text-black border border-black hover:text-black text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center"
      : variant === "primary"
      ? "bg-secondary relative z-10 hover:bg-secondary/90  border border-secondary text-black text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,_0px_1px_0px_0px_#FFFFFF60_inset  hover:-translate-y-1 active:-translate-y-0"
      : variant === "muted"
      ? "bg-neutral-800 relative z-10 hover:bg-neutral-900  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center shadow-[0px_1px_0px_0px_#FFFFFF20_inset]"
      : "";
  return (
    <Tag
      className={cn(
        "bg-secondary relative z-10 bg-transparent hover:border-secondary hover:bg-secondary/50  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center ",
        variantClass,
        className
      )}
      {...props}
    >
      {children ?? `Get Started`}
    </Tag>
  );
};
