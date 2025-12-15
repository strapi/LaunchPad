import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "tracking-tight pb-1 bg-clip-text text-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-foreground to-foreground/80",
        primary:
          "bg-gradient-to-t from-primary to-primary/80",
        secondary:
          "bg-gradient-to-t from-secondary to-secondary/80",
        muted:
          "bg-gradient-to-t from-muted-foreground to-muted-foreground/60",
        light: 
          "bg-gradient-to-t from-white to-white/80",
      },
      size: {
        default: "text-2xl sm:text-3xl lg:text-4xl",
        xxs: "text-base sm:text-lg lg:text-lg",
        xs: "text-lg sm:text-xl lg:text-2xl",
        sm: "text-xl sm:text-2xl lg:text-3xl",
        md: "text-2xl sm:text-3xl lg:text-4xl",
        lg: "text-3xl sm:text-4xl lg:text-5xl",
        xl: "text-4xl sm:text-5xl lg:text-6xl",
        xxl: "text-5xl sm:text-6xl lg:text-7xl",
        xxxl: "text-6xl sm:text-7xl lg:text-8xl",
      },
      weight: {
        default: "font-bold",
        thin: "font-thin",
        base: "font-normal",
        medium: "font-medium",
        semi: "font-semibold",
        bold: "font-bold",
        black: "font-black",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
    },
  }
)

export interface GradientHeadingProps extends VariantProps<typeof headingVariants> {
  asChild?: boolean
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p'
}

const GradientHeading = React.forwardRef<HTMLHeadingElement, GradientHeadingProps>(
  ({ asChild, variant, weight, size, className, children, as: Tag = 'h3', ...props }, ref) => {
    const Comp = asChild ? Slot : Tag
    return (
      <Comp ref={ref} {...props} className={className}>
        <span className={cn(headingVariants({ variant, size, weight }))}>
          {children}
        </span>
      </Comp>
    )
  }
)

GradientHeading.displayName = "GradientHeading"

export { GradientHeading, headingVariants }
