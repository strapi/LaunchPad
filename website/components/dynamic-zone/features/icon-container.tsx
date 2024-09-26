import { cn } from "@/lib/utils";

import React, { HTMLAttributes } from "react";

export const IconContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-16 w-16 rounded-lg border-2 bg-[rgba(40,40,40)] relative",
        "border-[rgba(255,_255,_255,_0.20)]",
        "shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)_inset]",
        "flex-shrink-0",
        "hover:scale-[0.98] transition duration-200 mx-4",
        className
      )}
      {...props}
    >
      <div className="h-8 w-8 rounded-md overflow-hidden">{children}</div>
    </div>
  );
};
