import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react"
import type React from "react"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type PolymorphicAsProp<E extends ElementType> = {
  as?:
    | E
    | React.ComponentType<Omit<ComponentPropsWithoutRef<E>, "as">>
    | React.FunctionComponent<Omit<ComponentPropsWithoutRef<E>, "as">>
}

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  Omit<ComponentPropsWithoutRef<E>, "as"> & PolymorphicAsProp<E>
>

const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      h1: "scroll-m-20 font-semibold leading-[100%] tracking-[0%] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px]",
      h2: "scroll-m-20 font-semibold leading-[100%] tracking-[0%] text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[52px]",
      h3: "scroll-m-20 font-semibold tracking-[0%] text-[24px] leading-[24px] sm:text-[28px] sm:leading-[28px] md:text-[32px] md:leading-[32px] lg:text-[36px] lg:leading-[36px] xl:text-[40px] xl:leading-[40px]",
      h4: "scroll-m-20 font-medium tracking-[0px] align-middle text-[20px] leading-[20px] sm:text-[22px] sm:leading-[22px] md:text-[26px] md:leading-[26px] lg:text-[28px] lg:leading-[28px] xl:text-[32px] xl:leading-[32px]",
      p: "font-extralight leading-[100%] tracking-[0%] text-center text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px]",
      base: "font-extralight leading-[100%] tracking-[0%] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px]",
      quote: "mt-6 border-l-2 pl-6 italic font-extralight leading-[100%] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px]",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-xs sm:text-sm",
      lead: "font-extralight text-muted-foreground leading-[100%] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]",
      large: "font-medium leading-[100%] text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px] xl:text-[32px]", 
      small: "font-light leading-[100%] tracking-[0%] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]",
      muted: "font-light text-muted-foreground leading-[100%] text-xs sm:text-sm",
      link: "font-medium text-cyan-600 hover:underline dark:text-primary leading-[100%] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px]",
    },
  },
  defaultVariants: {
    variant: "base",
  },
})
type TypographyCvaProps = VariantProps<typeof typographyVariants>

const defaultElement = "base"

const defaultElementMapping: Record<
  NonNullable<TypographyCvaProps["variant"]>,
  ElementType
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  quote: "blockquote" as "p",
  code: "code",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  link: "a",
  base: "p",
} as const

export function Typography<E extends ElementType = typeof defaultElement>({
  as,
  children,
  className,
  variant,
  ...restProps
}: PolymorphicProps<E> & TypographyCvaProps) {
  const Component: ElementType =
    as ?? defaultElementMapping[variant ?? "base"] ?? defaultElement

  return (
    // @ts-ignore
    <Component
      {...(restProps as ComponentPropsWithoutRef<E>)}
      // @ts-ignore
      className={cn(typographyVariants({ variant }), className)}
      data-typography
      data-typography-variant={variant}
    >
      {children}
    </Component>
  )
}