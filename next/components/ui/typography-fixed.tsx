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
      h1: "scroll-m-20 text-[64px] font-semibold leading-[100%] tracking-[0%]",
      h2: "scroll-m-20 text-[52px] font-semibold leading-[100%] tracking-[0%] text-center",
      h3: "scroll-m-20 text-[40px] font-semibold leading-[40px] tracking-[0%]",
      h4: "scroll-m-20 text-[32px] font-medium leading-[32px] tracking-[0px] align-middle",
      p: "text-[32px] font-extralight leading-[100%] tracking-[0%] text-center",
      base: "text-[24px] font-extralight leading-[100%] tracking-[0%]",
      quote: "mt-6 border-l-2 pl-6 italic text-[24px] font-extralight leading-[100%]",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl font-extralight text-muted-foreground leading-[100%]",
      large: "text-[32px] font-medium leading-[100%]", 
      small: "text-[16px] font-light leading-[100%] tracking-[0%]",
      muted: "text-sm font-light text-muted-foreground leading-[100%]",
      link: "font-medium text-cyan-600 hover:underline dark:text-primary text-[24px] leading-[100%]",
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

export function TypographyFixed<E extends ElementType = typeof defaultElement>({
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